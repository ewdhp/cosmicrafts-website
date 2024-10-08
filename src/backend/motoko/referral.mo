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
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Utils "Utils";

shared actor class Referral() {

  public type RNode = {
    id : Principal;
    username : Text;
    multiplier : Float;
    earnings : Float;
    referralCode : Text;
    referrerId : ?Principal;
    nodes : [RNode];
  };

  stable var _referrals : [(Principal, RNode)] = [];
  var referrals : HashMap.HashMap<Principal, RNode> = HashMap.fromIter(
    _referrals.vals(),
    0,
    Principal.equal,
    Principal.hash,
  );
  stable var _refCodes : [Text] = [];
  var refCodes : Buffer.Buffer<Text> = Buffer.Buffer<Text>(_refCodes.size());
  let cosmicWords = ["PUMP", "WAGMI", "SHILL", "GWEI", "SATOSHI", "MOON", "WHALE", "LAMBO", "HODL", "FOMO"];

  // Get All Referrals
  public query func getAllReferrals() : async ?[(Principal, RNode)] {
    return ?Iter.toArray(referrals.entries());
  };

  // Get the referrer id by code
  public query func getReferrerIdByCode(code : Text) : async ?Principal {
    for ((_, node) in referrals.entries()) {
      if (node.referralCode == code) {
        return ?node.id;
      };
    };
    return null;
  };

  // Get the referral code by id
  public query func getReferralCode(id : Principal) : async ?Text {
    for ((_, node) in referrals.entries()) {
      if (node.id == id) {
        return ?node.referralCode;
      };
    };
    return null;
  };

  // Get the referral node by id
  public query func getReferralNodeById(id : Principal) : async ?RNode {
    for ((_, node) in referrals.entries()) {
      if (node.id == id) {
        return ?node;
      };
    };
    return null;
  };

  // Get the count of the matching referrals searched by id
  public query func getReferralCountById(id : Principal) : async Int {
    var count = 0;
    for ((_, node) in referrals.entries()) {
      if (node.referrerId == ?id) {
        count += 1;
      };
    };
    return count;
  };

  // Get an array of getReferralCount from all the referrals
  public func getAllReferralCounts() : async [(Principal, Int, Float, Float)] {
    var counts : [(Principal, Int, Float, Float)] = [];
    for ((_, node) in referrals.entries()) {
      let count = await getReferralCountById(node.id);
      counts := Array.append<(Principal, Int, Float, Float)>(
        counts,
        [(node.id, count, node.multiplier, node.earnings)],
      );
    };
    return counts;
  };

  // Calculate the multiplier for the referral
  public func calculateMultiplier(id : Principal) : async (Int, Float) {
    let n = await getReferralCountById(id);
    if (n == 0) {
      return (n, 1.0);
    };
    Debug.print("ID: " # Principal.toText(id));
    Debug.print("Total referrals: " # Int.toText(n));
    var x = 0.0;

    for (count in Iter.range(0, n)) {
      let i = Float.fromInt(count + 1);
      x += 1.0 + 1.0 / i;
      Debug.print(Int.toText(count) # " referral's with  " # Float.toText(x - 1) # " of multiplier");
    };
    return (n, x - 1);
  };

  // Helper function to build the referral tree
  private func buildTree(nodeId : Principal) : async ?RNode {
    switch (await getReferralNodeById(nodeId)) {
      case (?node) {
        var childNodes : [RNode] = [];
        for ((_, refNode) in referrals.entries()) {
          if (refNode.referrerId == ?nodeId) {
            switch (await buildTree(refNode.id)) {
              case (?childNode) {
                childNodes := Array.append<RNode>(childNodes, [childNode]);
              };
              case null {};
            };
          };
        };
        return ?{ node with nodes = childNodes };
      };
      case null {
        return null;
      };
    };
  };

  // Get the referral tree for a specific ID
  public shared func getReferralTree(id : Principal) : async ?RNode {
    return await buildTree(id);
  };

  //Check if the referral is linked
  public func isReferralLinked(id : Principal) : async Bool {
    for ((_, node) in referrals.entries()) {
      if (node.id == id) {
        return true;
      };
    };
    return false;
  };

  // Link the referral to the account
  public func linkReferral(id : Principal, username : Text, code : Text) : async (Bool, Text) {

    if (await isReferralLinked(id)) {
      return (false, "Referral already linked");
    };

    Debug.print("Getting the referral id");

    let n = await getReferrerIdByCode(code);
    let foundId = switch (n) {
      case (?principal) {

        Debug.print(
          "Referral id found: " #
          Principal.toText(principal)
        );

        principal;
      };
      case (null) {

        Debug.print("Referral code not found");

        if (referrals.size() == 0) {
          Debug.print("Linking first account");
          let (refs, mult) = await calculateMultiplier(id);
          let earn = Float.fromInt(refs) * mult;
          let newNode : RNode = {
            id = id;
            username = username;
            multiplier = mult;
            earnings = earn;
            referralCode = code;
            referrerId = ?Principal.fromText("aaaaa-aa");
            nodes = [];
          };
          referrals.put(newNode.id, newNode);
          return (true, "Referral linked");
        };
        return (false, "Referral not linked");
      };
    };

    Debug.print("Finding referrer node by id");
    let node = await getReferralNodeById(foundId);
    let referrerNode = switch (node) {
      case (?node) {
        node;
      };
      case (null) {
        return (false, "Error. Referrer not found");
      };
    };

    Debug.print("Updating referrer nodes");
    let newNode : RNode = {
      id = id;
      username = "user1";
      multiplier = 1.0;
      earnings = 0.0;
      referralCode = await generateReferralCode();
      referrerId = ?foundId;
      nodes = [];
    };
    let updatedNode : RNode = {
      id = referrerNode.id;
      username = referrerNode.username;
      multiplier = referrerNode.multiplier;
      earnings = referrerNode.earnings;
      referralCode = referrerNode.referralCode;
      referrerId = referrerNode.referrerId;
      nodes = Array.append<RNode>(
        referrerNode.nodes,
        [newNode],
      );
    };

    referrals.put(newNode.id, newNode);
    referrals.put(updatedNode.id, updatedNode);

    Debug.print("Calculating earnings and multiplier");
    let (refsReferrer, multReferrer) = await calculateMultiplier(foundId);
    let earnReferrer = Float.fromInt(refsReferrer) * multReferrer;

    Debug.print(
      "Referrer has " # Int.toText(refsReferrer) #
      " referrals with " # Float.toText(multReferrer)
      # " of multiplier"
    );

    Debug.print("Updating referrer");

    let updReferrerNode : RNode = {
      id = referrerNode.id;
      username = referrerNode.username;
      multiplier = multReferrer;
      earnings = earnReferrer;
      referralCode = referrerNode.referralCode;
      referrerId = referrerNode.referrerId;
      nodes = Array.append<RNode>(
        referrerNode.nodes,
        [newNode],
      );
    };
    referrals.put(updReferrerNode.id, updReferrerNode);
    return (true, "Referral linked");
  };

  // Util to enerate a short UUID
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

  // Util to Generate a referral code
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

  // Util to generate n referral codes
  public func refCodeGen(n : Nat) : async (Bool, Text) {
    if (refCodes.size() > 0) {
      return (false, "Referral codes already generated");
    };
    for (i in Iter.range(0, n)) {
      let referralCode = await generateReferralCode();
      refCodes.add(referralCode);
    };
    return (true, "Referral codes generated");
  };

  // System functions to upgrade the canister
  system func preupgrade() {
    _referrals := Iter.toArray(referrals.entries());
  };
  system func postupgrade() {
    referrals := HashMap.fromIter(_referrals.vals(), 0, Principal.equal, Principal.hash);
  };
};
