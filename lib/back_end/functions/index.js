const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createUserProfile = functions.https.onCall((data, context) => {
    const uid = data.uid;
    const first_name = data.firstName;
    const last_name = data.lastName;
    const city = data.city;
    const address = data.address;
    const email = data.email;
    const phone_number = data.phoneNumber;
    const profile_picture_url = data.profilePictureUrl;

    const userRef = db.collection("users").doc(uid);

    return userRef.get().then(async (doc) => {
        if (doc.exists) {
            console.log("User already exists");
            return false;
        } else {
            console.log("Adding to users collection");
            return userRef.set({
                uid: uid,
                first_name: first_name,
                last_name: last_name,
                city: city,
                address: address,
                email: email,
                phone_number: phone_number,
                profile_picture_url: profile_picture_url,
            });
        }
    });
});

exports.setCustomClaimsToUser = functions.https.onCall((data, context) => {
    return admin
        .auth()
        .getUserByEmail(data.email)
        .then((user) => {
            return admin.auth().setCustomUserClaims(user.uid, {
                role: data.role,
            });
        })
        .then(() => {
            return {
                message: `Success! Admin: ${data.role} has been set for ${data.email}`,
            };
        })
        .catch((err) => {
            return err;
        });
});

exports.checkIfUserExists = functions.https.onCall((data, context) => {
    const userRef = admin.firestore().collection("users").doc(data.uid);

    return userRef
        .get()
        .then((doc) => {
            if (doc.exists) {
                return true;
            } else {
                console.log("User does not exist");
                return false;
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
            return false;
        });
});
