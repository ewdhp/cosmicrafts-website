import Types "Types";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Random "mo:base/Random";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Utils "Utils";

actor class Referral() {

  type PlayerId = Principal;

  public type RNode = {
    id : PlayerId;
    username : Text;
    multiplier : Float;
    earnings : Float;
    code : Text;
    nodes : [RNode];
  };

  stable var _refNodes : [(Principal, RNode)] = [];
  var refNodes : HashMap.HashMap<Principal, RNode> = HashMap.HashMap<Principal, RNode>(0, Principal.equal, Principal.hash);

  class ReferralTree() {

    public func createRoot(
      rootNode : RNode
    ) : ?RNode {
      if (refNodes.size() == 0) {
        refNodes.put(rootNode.id, rootNode);
        return ?rootNode;
      } else {
        return null;
      };
    };

    public func addReferral(
      newNode : RNode,
      parent : RNode,
    ) : async (Bool, Text, RNode) {

      let updatedParent : RNode = {
        id = parent.id;
        username = parent.username;
        multiplier = parent.multiplier;
        earnings = parent.earnings;
        code = parent.code;
        nodes = Array.append(parent.nodes, [newNode]);
      };

      refNodes.put(newNode.id, newNode);
      refNodes.put(updatedParent.id, updatedParent);
      return (true, "Referral added", updatedParent);
    };

    public func getRoot() : ?RNode {
      let entries = refNodes.entries();
      switch (entries.next()) {
        case (?entry) {
          return ?entry.1;
        };
        case (null) {
          return null;
        };
      };
    };

    public func findNode(
      root : RNode,
      evaluate : (RNode) -> async Bool,
    ) : async ?RNode {
      if (await evaluate(root)) {
        return ?root;
      };
      for (n in root.nodes.vals()) {
        let r = await findNode(n, evaluate);
        if (r != null) return r;
      };
      return null;
    };

    public func displayTree(root : RNode, indent : Text) : Text {
      var result = indent # "Username: " # root.username # ", Referral Code: " # root.code # "\n";
      for (child in root.nodes.vals()) {
        result #= displayTree(child, indent # "  ");
      };
      return result;
    };

    public func displayCurrentState() : async Text {
      switch (getRoot()) {
        case (?root) {
          return displayTree(root, "");
        };
        case (null) {
          return "No root node found.";
        };
      };
    };

  };

  public func createReferralAccount(
    id : Principal,
    referralCode : Text,
  ) : async (Bool, Text) {

    // Use the existing instance of ReferralTree
    let referral = ReferralTree();

    // Create a new node for the caller
    let newNode : RNode = {
      id = id;
      username = "user1";
      multiplier = 1.0;
      earnings = 0.0;
      code = referralCode;
      nodes = [];
    };

    // Get the root node
    let rootNode = switch (referral.getRoot()) {
      case (?rootNode) {
        Debug.print("Root node found");
        rootNode;
      };
      case (null) {
        Debug.print("Root node not found");
        let rootNode = referral.createRoot(newNode);
        switch (rootNode) {
          case (?_) {
            Debug.print("Root node created");
            return (true, "Referral account created");
          };
          case (null) {
            Debug.print("Root node not created");
            return (false, "Referral account not created");
          };
        };
      };
    };

    // Find the node with the given referral code
    let nodeFound = await referral.findNode(
      rootNode,
      func(node : RNode) : async Bool {
        return node.code == referralCode;
      },
    );

    // Handle the result of the node search
    switch (nodeFound) {
      case (?n) {
        Debug.print("Referral node found, username: " # n.username);
        let (result, text, referrerNode) = await referral.addReferral(newNode, n);
        return (result, text);
      };
      case (null) {
        Debug.print("Node not found");
        return (false, "Referral code not found");
      };
    };
  };

  public query func getNodeByCaller() : async ?[(Principal, RNode)] {
    return ?Iter.toArray(refNodes.entries());
  };

  let cosmicWords = ["PUMP", "WAGMI", "SHILL", "GWEI", "SATOSHI", "MOON", "WHALE", "LAMBO", "HODL", "FOMO"];

  private func generateShortUUID() : async Nat {
    let randomBytes = await Random.blob();
    var uuid : Nat = 0;
    let byteArray = Blob.toArray(randomBytes);
    for (i in Iter.range(0, 3)) {
      uuid := Nat.add(
        Nat.bitshiftLeft(uuid, 8),
        Nat8.toNat(byteArray[i]),
      );
    };
    uuid := uuid % 10000;
    return uuid;
  };

  private func generateReferralCode() : async Text {
    let uuid = await generateShortUUID();
    let indices : [Nat] = Array.tabulate(
      cosmicWords.size(),
      func(i : Nat) : Nat { i },
    );
    let shuffledIndices = Utils.shuffleArray(indices);
    let word = cosmicWords[shuffledIndices[0]];
    let referralCode = word # Nat.toText(uuid);
    referralCode;
  };

  system func preupgrade() {
    _refNodes := Iter.toArray(refNodes.entries());
  };

  system func postupgrade() {
    refNodes := HashMap.fromIter(_refNodes.vals(), 0, Principal.equal, Principal.hash);
  };
};
