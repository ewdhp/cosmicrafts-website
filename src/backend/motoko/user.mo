import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Types "Types";

//import Referral "canister:referral";

actor class User() {
  public type UserID = Types.UserID;
  public type UserBasicInfo = Types.UserBasicInfo;
  public type UserNameBasicInfo = Text;
  public type AvatarIDBasicInfo = Nat;
  public type LevelBasicInfo = Nat;
  public type EloBasicInfo = Float;
  public type VerificationBadgeBasicInfo = Bool;
  public type TitleBasicInfo = Text;
  public type DescriptionBasicInfo = Text;
  public type CountryBasicInfo = Text;

  public type FriendRequest = Types.FriendRequest;
  public type Notification = Types.Notification;
  public type UserProfile = Types.UserProfile;
  public type UserNetwork = Types.UserNetwork;
  public type AIFeatures = Types.AIFeatures;
  public type FriendDetails = Types.FriendDetails;
  public type Comment = Types.Comment;
  public type Post = Types.Post;
  public type Like = Types.Like;

  stable var _userProfile : [(UserID, UserProfile)] = [];
  var userProfile : HashMap.HashMap<UserID, UserProfile> = HashMap.fromIter(
    _userProfile.vals(),
    0,
    Principal.equal,
    Principal.hash,
  );
  stable var _userBasicInfo : [(UserID, UserBasicInfo)] = [];
  var userBasicInfo : HashMap.HashMap<UserID, UserBasicInfo> = HashMap.fromIter(
    _userBasicInfo.vals(),
    0,
    Principal.equal,
    Principal.hash,
  );
  stable var _userNetwork : [(UserID, UserNetwork)] = [];
  var userNetwork : HashMap.HashMap<UserID, UserNetwork> = HashMap.fromIter(
    _userNetwork.vals(),
    0,
    Principal.equal,
    Principal.hash,
  );

  //////////  Register  //////////

  public shared ({ caller : UserID }) func signup(
    username : Text,
    avatarId : Nat,
    code : Text,
  ) : async (Bool, Text) {
    switch (userBasicInfo.get(caller)) {
      case (?_) {
        return (false, "User is already registered");
      };
      case (null) {

        let registrationDate = Time.now();
        let newPlayer : UserBasicInfo = {
          id = caller;
          username = username;
          avatarId = avatarId;
          level = 0;
          elo = 1200.0;
          verificationBadge = false;
          title = null;
          description = null;
          country = null;
          registrationDate = registrationDate;
        };
        let newUserNetwork : UserNetwork = {
          connection = {
            platform = #cosmicrafts;
            username = username;
            profileLink = "/profile/username-uuid";
            memberSince = registrationDate;
          };
          notifications = ?[];
          connections = ?[];
          friends = ?[];
          friendRequests = ?[];
          mutualFriends = ?[];
          blockedUsers = ?[];
          following = ?[];
          followers = ?[];
          posts = ?[];
          comments = ?[];
          likes = ?[];
        };

        // let result = await initAchievements();

        userNetwork.put(caller, newUserNetwork);
        userBasicInfo.put(caller, newPlayer);

        return (true, "User registered successfully");
      };
    };
  };

  public shared func signupByID(
    userId : Principal,
    username : Text,
    avatarId : Nat,
    code : Text,
  ) : async (Bool, Text) {
    switch (userBasicInfo.get(userId)) {
      case (?_) {
        return (false, "User is already registered");
      };
      case (null) {

        let registrationDate = Time.now();
        let newPlayer : UserBasicInfo = {
          id = userId;
          username = username;
          avatarId = avatarId;
          level = 0;
          elo = 1200.0;
          verificationBadge = false;
          title = null;
          description = null;
          country = null;
          registrationDate = registrationDate;
        };
        let newUserNetwork : UserNetwork = {
          connection = {
            platform = #cosmicrafts;
            username = username;
            profileLink = "/profile/username-uuid";
            memberSince = registrationDate;
          };
          notifications = ?[];
          connections = ?[];
          friends = ?[];
          friendRequests = ?[];
          mutualFriends = ?[];
          blockedUsers = ?[];
          following = ?[];
          followers = ?[];
          posts = ?[];
          comments = ?[];
          likes = ?[];
        };

        /**referral
        let r = Referral;
        let (success, text) = await r.linkReferral(userId, code);

        if (not success) {
          return (false, text);
        };
        */
        // let result = await initAchievements();
        // createMissionsPeriodically
        // mintDeck
        // some nfts mintNFT
        // stats

        userNetwork.put(userId, newUserNetwork);
        userBasicInfo.put(userId, newPlayer);

        return (true, "User registered successfully");
      };
    };
  };

  public query ({ caller }) func userExists() : async Bool {
    switch (userBasicInfo.get(caller)) {
      case null { return false };
      case (?_) { return true };
    };
  };

  //////////  User Profile  //////////

  // Get the user profile by caller
  public query ({ caller }) func getUserProfileByCaller() : async ?UserProfile {
    return userProfile.get(caller);
  };
  // Get the user profile by id
  public query func getUserProfileByID(id : UserID) : async ?UserProfile {
    return userProfile.get(id);
  };

  //////////  User Basic Info  //////////

  // Get the basic user information caller
  public query ({ caller }) func getUserBasicInfo() : async ?UserBasicInfo {
    return userBasicInfo.get(caller);
  };
  // Get the basic user information by id
  public query func getUserBasicInfoByID(id : UserID) : async ?UserBasicInfo {
    return userBasicInfo.get(id);
  };
  // Get the basic user information by id
  public query func getAllUsersBasicInfo() : async [UserBasicInfo] {
    return Iter.toArray(userBasicInfo.vals());
  };
  // Update the user in userBasicInfo information
  public shared ({ caller }) func updateUserBasicInfo(
    newUsername : ?UserNameBasicInfo,
    newAvatarId : ?AvatarIDBasicInfo,
    newLevel : ?LevelBasicInfo,
    newElo : ?EloBasicInfo,
    newVerificationBadge : ?VerificationBadgeBasicInfo,
    newTitle : ?TitleBasicInfo,
    newDescription : ?DescriptionBasicInfo,
    newCountry : ?CountryBasicInfo,
  ) : async (Bool, Text) {

    switch (userBasicInfo.get(caller)) {
      case (null) return (false, "User not found");
      case (?info) {
        let updatedInfo = {
          id = info.id;
          registrationDate = info.registrationDate;
          username = switch (newUsername) {
            case (?value) value;
            case (null) info.username;
          };
          avatarId = switch (newAvatarId) {
            case (?value) value;
            case (null) info.avatarId;
          };
          level = switch (newLevel) {
            case (?value) value;
            case (null) info.level;
          };
          elo = switch (newElo) {
            case (?value) value;
            case (null) info.elo;
          };
          verificationBadge = switch (newVerificationBadge) {
            case (?value) value;
            case (null) info.verificationBadge;
          };
          title = switch (newTitle) {
            case (?value) ?value;
            case (null) info.title;
          };
          description = switch (newDescription) {
            case (?value) ?value;
            case (null) info.description;
          };
          country = switch (newCountry) {
            case (?value) ?value;
            case (null) info.country;
          };
        };
        userBasicInfo.put(caller, updatedInfo);
        return (true, "User updated successfully");
      };
    };
  };

  //////////  User Network  //////////

  // Get the user network information
  public func getUserNetwork(id : UserID) : async ?UserNetwork {
    return userNetwork.get(id);
  };

  // Send a friend request
  public func sendFriendRequest(recipient : Principal, request : FriendRequest) : async Bool {
    switch (userNetwork.get(recipient)) {
      case (null) return false;
      case (?network) {
        switch (network.friendRequests) {
          case (null) return false;
          case (?friendRequests) {
            let updatedRequests = Array.append<FriendRequest>(
              friendRequests,
              [request],
            );
            let updatedUserNetwork = {
              network with
              friendRequests = ?updatedRequests
            };
            userNetwork.put(recipient, updatedUserNetwork);
            return true;
          };
        };
      };
    };
  };

  // Accept a friend request
  public shared ({ caller }) func acceptFriendRequest(
    fromUserID : UserID,
    fromUsername : Text,
    avatarId : Nat,
  ) : async Bool {

    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.friendRequests) {
          case (null) return false;
          case (?friendRequests) {
            let requestOpt = Array.find<FriendRequest>(
              friendRequests,
              func(request) {
                request.from == fromUserID;
              },
            );
            switch (requestOpt) {
              case (null) return false;
              case (?request) {
                let indexOpt = Array.indexOf<FriendRequest>(
                  request,
                  friendRequests,
                  func(a : FriendRequest, b : FriendRequest) : Bool {
                    a.timestamp == b.timestamp and a.from == b.from and a.to == b.to
                  },
                );
                switch (indexOpt) {
                  case (null) return false;
                  case (?index) {
                    let updatedFriendRequests = Array.filter<FriendRequest>(
                      friendRequests,
                      func(request) {
                        request != friendRequests[index];
                      },
                    );
                    let newFriend : FriendDetails = {
                      id = fromUserID;
                      username = fromUsername;
                      avatar = avatarId;
                      friendProfile = null;
                    };
                    let updatedFriends = switch (network.friends) {
                      case (null) [newFriend];
                      case (?friends) Array.append<FriendDetails>(
                        friends,
                        [newFriend],
                      );
                    };
                    let fromUserNetworkOpt = userNetwork.get(fromUserID);
                    switch (fromUserNetworkOpt) {
                      case (null) return false;
                      case (?fromUserNetwork) {
                        let updatedNotifications = switch (
                          fromUserNetwork.notifications
                        ) {
                          case (null) [{
                            id = 1;
                            from = #FriendRequest(fromUserID);
                            body = "Friend Request accepted";
                            timestamp = Time.now();
                          }];
                          case (?notifications) {
                            let nCount = notifications.size();
                            let newNotification : Notification = {
                              id = nCount + 1;
                              from = #FriendRequest(fromUserID);
                              body = "Friend Request accepted";
                              timestamp = Time.now();
                            };
                            Array.append<Notification>(
                              notifications,
                              [newNotification],
                            );
                          };
                        };
                        let updatedFromUserNetwork = {
                          fromUserNetwork with
                          notifications = ?updatedNotifications
                        };
                        userNetwork.put(
                          fromUserID,
                          updatedFromUserNetwork,
                        );
                      };
                    };
                    let updatedUserNetwork = {
                      network with
                      friends = ?updatedFriends;
                      friendRequests = ?updatedFriendRequests;
                    };
                    userNetwork.put(caller, updatedUserNetwork);
                    return true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  // Delete a friend request
  public shared ({ caller }) func deleteFriendRequest(requestId : UserID) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.friendRequests) {
          case (null) return false;
          case (?friendRequests) {
            let updatedRequests = Array.filter<FriendRequest>(
              friendRequests,
              func(request) {
                request.from != requestId;
              },
            );
            let updatedUserNetwork = {
              network with
              friendRequests = ?updatedRequests
            };
            userNetwork.put(caller, updatedUserNetwork);
            return true;
          };
        };
      };
    };
  };

  // Get friend requests with pagination
  public query ({ caller }) func getFriendRequests(page : Nat) : async ?[FriendRequest] {
    let userNetworkOpt = userNetwork.get(caller);
    switch (userNetworkOpt) {
      case (null) return null;
      case (?network) {
        switch (network.friendRequests) {
          case (null) return null;
          case (?friendRequests) {
            let startIndex = page * 10;
            let endIndex = if (
              (page + 1) * 10 < friendRequests.size()
            ) (page + 1) * 10 else friendRequests.size();
            if (startIndex >= friendRequests.size()) (return null);
            ?Iter.toArray(
              Array.slice<FriendRequest>(
                friendRequests,
                startIndex,
                endIndex,
              )
            );
          };
        };
      };
    };
  };

  // Add a new friend
  public shared ({ caller }) func addFriend(friendId : UserID) : async (Bool, Text) {
    let friend = switch (userBasicInfo.get(friendId)) {
      case null { return (false, "Friend ID not found") };
      case (?friend) {
        friend;
      };
    };
    let newFriend : FriendDetails = {
      id = friendId;
      username = friend.username;
      avatar = friend.avatarId;
      friendProfile = null;
    };
    switch (userNetwork.get(caller)) {
      case (null) return (false, "userNetwork not found");
      case (?network) {
        switch (network.friends) {
          case (null) return (false, "network.friends null");
          case (?friends) {
            let updatedFriends = Array.append<FriendDetails>(
              friends,
              [newFriend],
            );
            let updatedUserNetwork = {
              network with
              friends = ?updatedFriends
            };
            userNetwork.put(
              caller,
              updatedUserNetwork,
            );
            return (true, "Friend added successfully");
          };
        };
      };
    };
  };

  // Delete a friend
  public func deleteFriend(caller : Principal, deleteId : UserID) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.friends) {
          case (null) return false;
          case (?networkFriends) {
            let updatedFriends = Array.filter<FriendDetails>(
              networkFriends,
              func(friend) {
                friend.id != deleteId;
              },
            );
            let updatedUserNetwork = {
              network with
              friends = ?updatedFriends
            };
            userNetwork.put(
              caller,
              updatedUserNetwork,
            );
            return true;
          };
        };
      };
    };
  };

  // Get the all friends with pagination
  public query ({ caller }) func getAllFriends(page : Nat) : async ?[FriendDetails] {
    switch (userNetwork.get(caller)) {
      case (null) return null;
      case (?userNetwork) {
        switch (userNetwork.friends) {
          case (null) return null;
          case (?friends) {
            let start = page * 10;
            let end = if (
              (page + 1) * 10 < friends.size()
            ) (page + 1) * 10 else friends.size();
            if (start >= friends.size()) (return null);
            ?Iter.toArray(
              Array.slice<FriendDetails>(
                friends,
                start,
                end,
              )
            );
          };
        };
      };
    };
  };

  // Create a post by caller
  public shared ({ caller }) func createPost(
    userID : UserID,
    username : Text,
    images : ?[Nat],
    content : Text,
  ) : async Bool {

    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.posts) {
          case (null) return false;
          case (?posts) {
            let postCount = posts.size() + 1;
            let newPost : Post = {
              id = postCount;
              userId = userID;
              username = username;
              images = switch (images) {
                case (?images) ?images;
                case (null) ?[];
              };
              content = content;
              timestamp = Time.now();
              likes = ?[];
              comments = ?[];
            };
            let updatedPosts = Array.append<Post>(
              posts,
              [newPost],
            );
            let updatedUserNetwork = {
              network with
              posts = ?updatedPosts
            };
            userNetwork.put(
              caller,
              updatedUserNetwork,
            );
            return true;
          };
        };
      };
    };
  };

  // Get a post by caller and postId
  public query ({ caller }) func getPost(postId : Nat) : async ?Post {
    let userNetworkOpt = userNetwork.get(caller);
    switch (userNetworkOpt) {
      case (null) return null;
      case (?network) {
        switch (network.posts) {
          case (null) return null;
          case (?posts) {
            let postOpt = Array.find<Post>(
              posts,
              func(post) {
                post.id == postId;
              },
            );
            return postOpt;
          };
        };
      };
    };
  };

  // Update a post by postId and caller
  public shared ({ caller }) func updatePost(postId : Nat, newContent : Text) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.posts) {
          case (null) return false;
          case (?posts) {
            if (postId >= posts.size() or posts[postId].userId != caller) {
              return false; // Invalid index or not the author
            };
            let updatedPost = {
              posts[postId] with
              content = newContent;
              timestamp = Time.now(); // Update the timestamp to the current time
            };
            let filteredPosts = Array.filter<Post>(
              posts,
              func(post : Post) : Bool {
                post.id != postId;
              },
            );
            let updatedPosts = Array.append(filteredPosts, [updatedPost]);
            let updatedNetwork = {
              network with
              posts = ?updatedPosts;
            };
            userNetwork.put(caller, updatedNetwork);
            return true;
          };
        };
      };
    };
  };

  // Delete a post by postId and caller
  public shared ({ caller }) func deletePost(postId : Nat) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.posts) {
          case (null) return false;
          case (?posts) {
            let updatedPosts = Array.filter<Post>(
              posts,
              func(post : Post) : Bool {
                post.id != postId;
              },
            );
            let updatedNetwork = {
              network with
              posts = ?updatedPosts;
            };
            userNetwork.put(caller, updatedNetwork);
            return true;
          };
        };
      };
    };
  };

  // Create a comment in a post
  public shared ({ caller }) func createComment(
    postId : Nat,
    fromUserID : UserID,
    fromUsername : Text,
    content : Text,
  ) : async Bool {

    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.posts) {
          case (null) return false;
          case (?posts) {
            let commentCount = posts.size() + 1;
            let postOpt = Array.find<Post>(
              posts,
              func(post) {
                post.id == postId;
              },
            );
            switch (postOpt) {
              case (null) return false;
              case (?post) {

                let newComment : Comment = {
                  id = commentCount;
                  postId = postId;
                  fromUserID = fromUserID;
                  fromUsername = fromUsername;
                  content = content;
                  timestamp = Time.now();
                  likes = ?[];
                };
                let updatedComments = switch (post.comments) {
                  case (null) [newComment];
                  case (?comments) Array.append<Comment>(
                    comments,
                    [newComment],
                  );
                };
                let updatedPost = {
                  post with
                  comments = ?updatedComments
                };
                let updatedPosts = Array.map<Post, Post>(
                  posts,
                  func(p : Post) : Post {
                    if (p.id == postId) updatedPost else p;
                  },
                );
                let updatedUserNetwork = {
                  network with
                  posts = ?updatedPosts
                };
                userNetwork.put(caller, updatedUserNetwork);
                return true;
              };
            };
          };
        };
      };
    };
  };

  // Get a comment by user ID and comment ID
  public query func getComment(fromUserID : UserID, commentId : Nat) : async ?Comment {
    let userNetworkOpt = userNetwork.get(fromUserID);
    switch (userNetworkOpt) {
      case (null) return null;
      case (?network) {
        switch (network.comments) {
          case (null) return null;
          case (?comments) {
            let commentOpt = Array.find<Comment>(
              comments,
              func(comment) {
                comment.id == commentId;
              },
            );
            return commentOpt;
          };
        };
      };
    };
  };

  // Update comment by caller and comment ID
  public shared ({ caller }) func updateComment(
    commentId : Nat,
    newContent : Text,
  ) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.comments) {
          case (null) return false;
          case (?comments) {
            let commentOpt = Array.find<Comment>(
              comments,
              func(comment) {
                comment.id == commentId;
              },
            );
            switch (commentOpt) {
              case (null) return false;
              case (?comment) {
                let updatedComment = {
                  comment with
                  content = newContent;
                  timestamp = Time.now();
                };
                let updatedComments = Array.map<Comment, Comment>(
                  comments,
                  func(c : Comment) : Comment {
                    if (c.id == commentId) updatedComment else c;
                  },
                );
                let updatedNetwork = {
                  network with
                  comments = ?updatedComments;
                };
                userNetwork.put(caller, updatedNetwork);
                return true;
              };
            };
          };
        };
      };
    };
  };

  // Delete comment from caller by comment ID
  public shared ({ caller }) func deleteComment(commentId : Nat) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.comments) {
          case (null) return false;
          case (?comments) {
            let updatedComments = Array.filter<Comment>(
              comments,
              func(comment : Comment) : Bool {
                comment.id != commentId;
              },
            );
            let updatedNetwork = {
              network with
              comments = ?updatedComments;
            };
            userNetwork.put(caller, updatedNetwork);
            return true;
          };
        };
      };
    };
  };

  // Give a like to post
  public shared ({ caller }) func likePost(
    postId : Nat,
    likeId : Nat,
    fromUserID : UserID,
    fromUsername : Text,
    timestamp : Time.Time,
  ) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.posts) {
          case (null) return false;
          case (?posts) {
            let postOpt = Array.find<Post>(
              posts,
              func(post) {
                post.id == postId;
              },
            );
            switch (postOpt) {
              case (null) return false;
              case (?post) {
                let newLike : Like = {
                  id = likeId;
                  fromUserID = fromUserID;
                  likeVariant = #Post;
                  fromUsername = fromUsername;
                  timestamp = timestamp;
                };
                let updatedLikes = switch (post.likes) {
                  case (null) [newLike];
                  case (?likes) Array.append<Like>(likes, [newLike]);
                };
                let updatedPost = {
                  post with
                  likes = ?updatedLikes
                };
                let updatedPosts = Array.map<Post, Post>(
                  posts,
                  func(p : Post) : Post {
                    if (p.id == postId) updatedPost else p;
                  },
                );
                let updatedUserNetwork = {
                  network with
                  posts = ?updatedPosts
                };
                userNetwork.put(caller, updatedUserNetwork);
                return true;
              };
            };
          };
        };
      };
    };
  };

  // Give a like to comment
  public shared ({ caller }) func likeComment(
    postId : Nat,
    commentId : Nat,
    likeId : Nat,
    fromUserID : UserID,
    fromUsername : Text,
    timestamp : Time.Time,
  ) : async Bool {

    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.posts) {
          case (null) return false;
          case (?posts) {
            let postOpt = Array.find<Post>(
              posts,
              func(post) {
                post.id == postId;
              },
            );
            switch (postOpt) {
              case (null) return false;
              case (?post) {
                let commentOpt = switch (post.comments) {
                  case (null) null;
                  case (?comments) Array.find<Comment>(
                    comments,
                    func(comment) {
                      comment.id == commentId;
                    },
                  );
                };
                switch (commentOpt) {
                  case (null) return false;
                  case (?comment) {
                    let newLike : Like = {
                      id = likeId;
                      fromUserID = fromUserID;
                      likeVariant = #Comment;
                      fromUsername = fromUsername;
                      timestamp = timestamp;
                    };
                    let updatedLikes = switch (comment.likes) {
                      case (null) [newLike];
                      case (?likes) Array.append<Like>(likes, [newLike]);
                    };
                    let updatedComment = {
                      comment with
                      likes = ?updatedLikes
                    };
                    switch (post.comments) {
                      case (null) return false;
                      case (?comments) {
                        let updatedComments = Array.map<Comment, Comment>(
                          comments,
                          func(c : Comment) : Comment {
                            if (c.id == commentId) updatedComment else c;
                          },
                        );
                        let updatedPost = {
                          post with
                          comments = ?updatedComments
                        };
                        let updatedPosts = Array.map<Post, Post>(
                          posts,
                          func(p : Post) : Post {
                            if (p.id == postId) updatedPost else p;
                          },
                        );
                        let updatedUserNetwork = {
                          network with
                          posts = ?updatedPosts
                        };
                        userNetwork.put(caller, updatedUserNetwork);
                        return true;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  // Unlike from a post ID by likeId and by caller
  public shared ({ caller }) func unLikeFromPost(postId : Nat, likeId : Nat) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.posts) {
          case (null) return false;
          case (?posts) {
            let postOpt = Array.find<Post>(
              posts,
              func(post) {
                post.id == postId;
              },
            );
            switch (postOpt) {
              case (null) return false;
              case (?post) {
                switch (post.likes) {
                  case (null) return false;
                  case (?likes) {
                    let updatedLikes = Array.filter<Like>(
                      likes,
                      func(like : Like) : Bool {
                        like.id != likeId;
                      },
                    );
                    let updatedPost = {
                      post with
                      likes = ?updatedLikes;
                    };
                    let updatedPosts = Array.map<Post, Post>(
                      posts,
                      func(p : Post) : Post {
                        if (p.id == postId) updatedPost else p;
                      },
                    );
                    let updatedNetwork = {
                      network with
                      posts = ?updatedPosts;
                    };
                    userNetwork.put(caller, updatedNetwork);
                    return true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  // Unlike from a comment ID by likeId and by caller
  public shared ({ caller }) func unLikeFromComment(commentId : Nat, likeId : Nat) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.comments) {
          case (null) return false;
          case (?comments) {
            let commentOpt = Array.find<Comment>(
              comments,
              func(comment) {
                comment.id == commentId;
              },
            );
            switch (commentOpt) {
              case (null) return false;
              case (?comment) {
                switch (comment.likes) {
                  case (null) return false;
                  case (?likes) {
                    let updatedLikes = Array.filter<Like>(
                      likes,
                      func(like : Like) : Bool {
                        like.id != likeId;
                      },
                    );
                    let updatedComment = {
                      comment with
                      likes = ?updatedLikes;
                    };
                    let updatedComments = Array.map<Comment, Comment>(
                      comments,
                      func(c : Comment) : Comment {
                        if (c.id == commentId) updatedComment else c;
                      },
                    );
                    let updatedNetwork = {
                      network with
                      comments = ?updatedComments;
                    };
                    userNetwork.put(caller, updatedNetwork);
                    return true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  // Get all likes from a post by postId and by query caller
  public query ({ caller }) func likesFromPost(postId : Nat) : async ?[Like] {
    let userNetworkOpt = userNetwork.get(caller);
    switch (userNetworkOpt) {
      case (null) return null;
      case (?network) {
        switch (network.posts) {
          case (null) return null;
          case (?posts) {
            let postOpt = Array.find<Post>(
              posts,
              func(post) {
                post.id == postId;
              },
            );
            switch (postOpt) {
              case (null) return null;
              case (?post) {
                return post.likes;
              };
            };
          };
        };
      };
    };
  };

  // Get all likes from a comment by commentId and by query caller
  public query ({ caller }) func likesFromComment(commentId : Nat) : async ?[Like] {
    let userNetworkOpt = userNetwork.get(caller);
    switch (userNetworkOpt) {
      case (null) return null;
      case (?network) {
        switch (network.comments) {
          case (null) return null;
          case (?comments) {
            let commentOpt = Array.find<Comment>(
              comments,
              func(comment) {
                comment.id == commentId;
              },
            );
            switch (commentOpt) {
              case (null) return null;
              case (?comment) {
                return comment.likes;
              };
            };
          };
        };
      };
    };
  };

  // Block a user by user ID
  public shared ({ caller }) func blockUser(userIdToBlock : UserID) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.blockedUsers) {
          case (null) return false;
          case (?blockedUsers) {
            let updatedBlockedUsers = Array.append<UserID>(
              blockedUsers,
              [userIdToBlock],
            );
            let updatedUserNetwork = {
              network with
              blockedUsers = ?updatedBlockedUsers
            };
            userNetwork.put(
              caller,
              updatedUserNetwork,
            );
            return true;
          };
        };
      };
    };
  };

  // Unblock a user by user ID
  public func unblockUser(caller : Principal, userIdToUnblock : UserID) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.blockedUsers) {
          case (null) return false;
          case (?blockedUsers) {
            let updatedBlockedUsers = Array.filter<UserID>(
              blockedUsers,
              func(userId) {
                userId != userIdToUnblock;
              },
            );
            let updatedUserNetwork = {
              network with
              blockedUsers = ?updatedBlockedUsers
            };
            userNetwork.put(
              caller,
              updatedUserNetwork,
            );
            return true;
          };
        };
      };
    };
  };

  // Get the blocked users with pagination
  public query ({ caller }) func getBlockedUsers(page : Nat) : async ?[UserID] {
    switch (userNetwork.get(caller)) {
      case (null) return null;
      case (?network) {
        switch (network.blockedUsers) {
          case (null) return null;
          case (?blockedUsers) {
            let startIndex = page * 10;
            let endIndex = if (
              (page + 1) * 10 < blockedUsers.size()
            ) (page + 1) * 10 else blockedUsers.size();
            if (startIndex >= blockedUsers.size()) return null;
            ?Iter.toArray(
              Array.slice<UserID>(
                blockedUsers,
                startIndex,
                endIndex,
              )
            );
          };
        };
      };
    };
  };

  // Follow a user by user ID
  public shared ({ caller }) func followUser(followId : UserID) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.following) {
          case (null) return false;
          case (?following) {
            let updatedFollowing = Array.append<UserID>(
              following,
              [followId],
            );
            let updatedUserNetwork = {
              network with
              following = ?updatedFollowing
            };
            userNetwork.put(
              caller,
              updatedUserNetwork,
            );
            return true;
          };
        };
      };
    };
  };

  // Unfollow a user by user ID
  public shared ({ caller }) func unfollowUser(unfollowId : UserID) : async Bool {
    switch (userNetwork.get(caller)) {
      case (null) return false;
      case (?network) {
        switch (network.following) {
          case (null) return false;
          case (?following) {
            let updatedFollowing = Array.filter<UserID>(
              following,
              func(followId) {
                followId != unfollowId;
              },
            );
            let updatedUserNetwork = {
              network with
              following = ?updatedFollowing
            };
            userNetwork.put(
              caller,
              updatedUserNetwork,
            );
            return true;
          };
        };
      };
    };
  };

  // Get the list of users that user caller is following with pagination
  public query ({ caller }) func getFollowing(page : Nat) : async ?[UserID] {
    switch (userNetwork.get(caller)) {
      case (null) return null;
      case (?network) {
        switch (network.following) {
          case (null) return null;
          case (?following) {
            let startIndex = page * 10;
            let endIndex = if (
              (page + 1) * 10 < following.size()
            ) (page + 1) * 10 else following.size();
            if (startIndex >= following.size()) {
              return null;
            };
            ?Iter.toArray(
              Array.slice<UserID>(
                following,
                startIndex,
                endIndex,
              )
            );
          };
        };
      };
    };
  };

  // Get the list of users that are following the user caller with pagination
  public query ({ caller }) func getFollowers(page : Nat) : async ?[UserID] {
    switch (userNetwork.get(caller)) {
      case (null) return null;
      case (?network) {
        switch (network.followers) {
          case (null) return null;
          case (?followers) {
            let startIndex = page * 10;
            let endIndex = if (
              (page + 1) * 10 < followers.size()
            ) (page + 1) * 10 else followers.size();
            if (startIndex >= followers.size()) {
              return null;
            };
            ?Iter.toArray(
              Array.slice<UserID>(
                followers,
                startIndex,
                endIndex,
              )
            );
          };
        };
      };
    };
  };

  // Get all notifications by caller with pagination
  public query ({ caller }) func getAllNotifications(page : Nat) : async ?[Notification] {
    switch (userNetwork.get(caller)) {
      case (null) return null;
      case (?network) {
        switch (network.notifications) {
          case (null) return null;
          case (?notifications) {
            let startIndex = page * 10;
            let endIndex = if (
              (page + 1) * 10 < notifications.size()
            ) (page + 1) * 10 else notifications.size();
            if (startIndex >= notifications.size()) {
              return null;
            };
            ?Iter.toArray(
              Array.slice<Notification>(
                notifications,
                startIndex,
                endIndex,
              )
            );
          };
        };
      };
    };
  };
};
