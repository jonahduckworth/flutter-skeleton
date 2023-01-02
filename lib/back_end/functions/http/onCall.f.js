const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

// exports.addNewCompany = functions.https.onCall((data, context) => {
//     const company = data.companyName;
//     const companyRef = db.collection("companies");

//     return companyRef
//         .where("name", "==", company)
//         .get()
//         .then((querySnapshot) => {
//             if (querySnapshot.empty) {
//                 console.log("Company does not exist");
//                 return companyRef.add({
//                     name: company,
//                 });
//             } else {
//                 console.log("Company exists");
//                 return true;
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//             return false;
//         });
// });

// exports.addNewUser = functions.https.onCall((data, context) => {
//     var exists = false;
//     const user = data.name;
//     const company = data.companyName;
//     const userRef = admin
//         .firestore()
//         .collection("users")
//         .where("name", "==", user);

//     return userRef.get().then((querySnapshot) => {
//         if (!querySnapshot.empty) {
//             // check each query to see if it belongs to the company
//             querySnapshot.forEach((doc) => {
//                 if (doc.data().company === company) {
//                     console.log("User already exists");
//                     exists = true;
//                 }
//             });

//             if (!exists) {
//                 console.log("Adding user to company");
//                 return admin
//                     .firestore()
//                     .collection("users")
//                     .doc(context.auth.uid)
//                     .set({
//                         name: data.name,
//                         company: data.companyName,
//                         email: data.email,
//                         roles: [data.role],
//                         uid: context.auth.uid,
//                     });
//             }
//         } else {
//             console.log("Adding user to company");
//             return admin
//                 .firestore()
//                 .collection("users")
//                 .doc(context.auth.uid)
//                 .set({
//                     name: data.name,
//                     company: data.companyName,
//                     email: data.email,
//                     roles: [data.role],
//                     uid: context.auth.uid,
//                 });
//         }
//     });
// });

// exports.updateEmployee = functions.https.onCall((data, context) => {
//     const userRef = db.collection("users").doc(data.uid);

//     return userRef
//         .get()
//         .then((doc) => {
//             if (doc.exists) {
//                 console.log("Updating user");
//                 doc.ref.update({
//                     name: data.name,
//                     email: data.email,
//                     roles: [data.role],
//                 });
//                 return true;
//             } else {
//                 console.log("User does not exist");
//                 return false;
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//             return false;
//         });
// });

// exports.removeUserFromUsersCollection = functions.https.onCall(
//     (data, context) => {
//         const company = data.companyName;
//         const userRef = db.collection("users").doc(data.uid);

//         return userRef
//             .get()
//             .then((doc) => {
//                 if (doc.exists) {
//                     console.log("User exists");
//                     if (doc.data().company === company) {
//                         console.log("Removing user from company");
//                         doc.ref.delete();
//                         return true;
//                     } else {
//                         console.log("User does not belong to company");
//                         return false;
//                     }
//                 } else {
//                     console.log("User does not exist");
//                     return false;
//                 }
//             })
//             .catch((error) => {
//                 console.log("Error getting documents: ", error);
//                 return false;
//             });
//     }
// );

// exports.removeUserFromAuth = functions.https.onCall((data, context) => {
//     const company = data.companyName;
//     const userRef = db.collection("users").doc(data.uid);

//     return userRef
//         .get()
//         .then((doc) => {
//             if (doc.exists) {
//                 console.log("User exists");
//                 if (doc.data().company === company) {
//                     console.log("Removing user from auth");
//                     admin.auth().deleteUser(data.uid);
//                     return true;
//                 } else {
//                     console.log("User does not belong to company");
//                     return false;
//                 }
//             } else {
//                 console.log("User does not exist");
//                 return false;
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//             return false;
//         });
// });

exports.setCustomClaimsToUser = functions.https.onCall((data, context) => {
    console.log("hiii");
    return admin
        .auth()
        .getUserByEmail(data.email)
        .then((user) => {
            console.log("hi");
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
            console.log("Adding user to users collection");
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

// exports.addPasswordCheck = functions.https.onCall((data, context) => {
//     const userRef = admin.firestore().collection("users").doc(context.auth.uid);

//     return userRef
//         .get()
//         .then((doc) => {
//             if (doc.exists) {
//                 console.log("User exists");
//                 doc.ref.update({
//                     updatedPassword: data.value,
//                 });
//                 return true;
//             } else {
//                 console.log("User does not exist");
//                 return false;
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//             return false;
//         });
// });

exports.checkIfUserExists = functions.https.onCall((data, context) => {
    const userRef = admin.firestore().collection("users").doc(data.uid);
    console.log(data.uid);

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

// exports.changePassword = functions.https.onCall((data, context) => {
//     const userRef = admin.firestore().collection("users").doc(context.auth.uid);

//     return userRef
//         .get()
//         .then((doc) => {
//             if (doc.exists) {
//                 console.log("Updating password");
//                 doc.ref.update({
//                     updatedPassword: true,
//                 });
//                 return admin
//                     .auth()
//                     .updateUser(context.auth.uid, {
//                         password: data.password,
//                     })
//                     .then(() => {
//                         return true;
//                     })
//                     .catch((error) => {
//                         console.log("Error updating password: ", error);
//                         return false;
//                     });
//             } else {
//                 console.log("User does not exist");
//                 return false;
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//             return false;
//         });
// });

// exports.addNewProject = functions.https.onCall((data, context) => {
//     const company = data.companyName;
//     const project = data.projectName;
//     const uid = context.auth.uid;
//     const companyRef = db.collection("companies");

//     return companyRef
//         .where("name", "==", company)
//         .get()
//         .then((querySnapshot) => {
//             if (querySnapshot.empty) {
//                 console.log("Company does not exist");
//                 return false;
//             } else {
//                 querySnapshot.forEach((doc) => {
//                     const projectRef = doc.ref.collection("projects");
//                     projectRef
//                         .where("name", "==", project)
//                         .get()
//                         .then((querySnapshot) => {
//                             if (querySnapshot.empty) {
//                                 console.log("Creating project");
//                                 projectRef.add({
//                                     name: project,
//                                 });
//                                 return true;
//                             } else {
//                                 console.log("Project already exists");
//                                 return false;
//                             }
//                         });
//                 });
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//             return false;
//         });
// });

// exports.removeProjectFromCompany = functions.https.onCall((data, context) => {
//     const company = data.companyName;
//     const project = data.projectName;
//     const uid = context.auth.uid;
//     const companyRef = db.collection("companies");

//     return companyRef
//         .where("name", "==", company)
//         .get()
//         .then((querySnapshot) => {
//             if (querySnapshot.empty) {
//                 console.log("Company does not exist");
//                 return false;
//             } else {
//                 querySnapshot.forEach((doc) => {
//                     const projectRef = doc.ref.collection("projects");
//                     projectRef
//                         .where("name", "==", project)
//                         .get()
//                         .then((querySnapshot) => {
//                             if (querySnapshot.empty) {
//                                 console.log("Project does not exist");
//                                 return false;
//                             } else {
//                                 querySnapshot.forEach((doc) => {
//                                     doc.ref.delete();
//                                 });
//                                 return true;
//                             }
//                         });
//                 });
//             }
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//             return false;
//         });
// });

// exports.addEmployeeToProject = functions.https.onCall((data, context) => {
//     const project = data.projectName;
//     const employee = data.employeeName;
//     const company = data.companyName;
//     const companyRef = db.collection("companies");

//     return companyRef
//         .where("name", "==", company)
//         .get()
//         .then((querySnapshot) => {
//             if (querySnapshot.empty) {
//                 console.log("Company does not exist");
//                 return false;
//             } else {
//                 querySnapshot.forEach((doc) => {
//                     const projectRef = doc.ref.collection("projects");
//                     projectRef
//                         .where("name", "==", project)
//                         .get()
//                         .then((querySnapshot) => {
//                             if (querySnapshot.empty) {
//                                 console.log("Project does not exist");
//                                 return false;
//                             } else {
//                                 querySnapshot.forEach((doc) => {
//                                     const workers = doc.data().workers;
//                                     try {
//                                         if (workers[employee] !== undefined) {
//                                             console.log(
//                                                 "Employee already exists in project"
//                                             );
//                                             return false;
//                                         } else {
//                                             console.log(
//                                                 "Adding employee to project"
//                                             );
//                                             doc.ref.set(
//                                                 {
//                                                     workers: {
//                                                         [employee]: {
//                                                             time: 0,
//                                                         },
//                                                     },
//                                                 },
//                                                 { merge: true }
//                                             );
//                                         }
//                                     } catch (e) {
//                                         console.log(
//                                             "Adding employee to project"
//                                         );
//                                         doc.ref.set(
//                                             {
//                                                 workers: {
//                                                     [employee]: {
//                                                         time: 0,
//                                                     },
//                                                 },
//                                             },
//                                             { merge: true }
//                                         );
//                                     }
//                                 });
//                                 return true;
//                             }
//                         });
//                 });
//             }
//         });
// });

// exports.removeUserFromProject = functions.https.onCall((data, context) => {
//     const project = data.projectName;
//     const employee = data.employeeName;
//     const company = data.companyName;
//     const companyRef = db.collection("companies");

//     return companyRef
//         .where("name", "==", company)
//         .get()
//         .then((querySnapshot) => {
//             if (querySnapshot.empty) {
//                 console.log("Company does not exist");
//                 return false;
//             } else {
//                 querySnapshot.forEach((doc) => {
//                     const projectRef = doc.ref.collection("projects");
//                     projectRef
//                         .where("name", "==", project)
//                         .get()
//                         .then((querySnapshot) => {
//                             if (querySnapshot.empty) {
//                                 console.log("Project does not exist");
//                                 return false;
//                             } else {
//                                 querySnapshot.forEach((doc) => {
//                                     const workers = doc.data().workers;
//                                     try {
//                                         if (workers[employee] !== undefined) {
//                                             console.log(
//                                                 "Removing employee from project"
//                                             );
//                                             doc.ref.set(
//                                                 {
//                                                     workers: {
//                                                         [employee]:
//                                                             admin.firestore.FieldValue.delete(),
//                                                     },
//                                                 },
//                                                 { merge: true }
//                                             );
//                                         } else {
//                                             console.log(
//                                                 "Employee does not exist in project"
//                                             );
//                                             return false;
//                                         }
//                                     } catch (e) {
//                                         console.log(
//                                             "Employee does not exist in project"
//                                         );
//                                         return false;
//                                     }
//                                 });
//                                 return true;
//                             }
//                         });
//                 });
//             }
//         });
// });

// exports.addTimeToCalendar = functions.https.onCall((data, context) => {
//     const company = data.companyName;
//     const project = data.projectName;
//     const uid = data.uid;
//     const date = data.date;
//     const time = data.time;
//     const companyRef = db.collection("companies");

//     return companyRef
//         .where("name", "==", company)
//         .get()
//         .then((querySnapshot) => {
//             if (querySnapshot.empty) {
//                 console.log("Company does not exist");
//                 return false;
//             } else {
//                 querySnapshot.forEach((doc) => {
//                     const projectRef = doc.ref.collection("projects");
//                     projectRef
//                         .where("name", "==", project)
//                         .get()
//                         .then((querySnapshot) => {
//                             if (querySnapshot.empty) {
//                                 console.log("Project does not exist");
//                                 return false;
//                             } else {
//                                 querySnapshot.forEach((doc) => {
//                                     const calendarRef = doc.ref
//                                         .collection("calendars")
//                                         .doc(uid);
//                                     calendarRef.get().then((querySnapshot) => {
//                                         if (querySnapshot.empty) {
//                                             console.log(
//                                                 "Adding time to calendar"
//                                             );
//                                             calendarRef.add(
//                                                 {
//                                                     times: {
//                                                         [date]: time,
//                                                     },
//                                                 },
//                                                 { merge: true }
//                                             );
//                                         } else {
//                                             console.log(
//                                                 "Adding time to calendar"
//                                             );
//                                             calendarRef.set(
//                                                 {
//                                                     times: {
//                                                         [date]: time,
//                                                     },
//                                                 },
//                                                 { merge: true }
//                                             );
//                                         }
//                                     });
//                                 });
//                             }
//                         });
//                 });
//             }
//         });
// });

// exports.getTimesFromCalendar = functions.https.onCall(async (data, context) => {
//     const company = data.companyName;
//     const projects = data.projects;
//     const uid = data.uid;
//     const companyRef = db.collection("companies");
//     const times = {};

//     const querySnapshot = await companyRef.where("name", "==", company).get();
//     if (querySnapshot.empty) {
//         console.log("Company does not exist");
//         return false;
//     }

//     const doc = querySnapshot.docs[0];
//     const projectRef = doc.ref.collection("projects");

//     const promises = [];
//     for (const project of projects) {
//         const querySnapshot = await projectRef
//             .where("name", "==", project)
//             .get();
//         if (querySnapshot.empty) {
//             console.log("Project does not exist");
//             return false;
//         }

//         const doc = querySnapshot.docs[0];
//         const calendarRef = doc.ref.collection("calendars").doc(uid);
//         const promise = calendarRef.get().then((querySnapshot) => {
//             if (querySnapshot.empty) {
//                 console.log("No times for this user");
//                 times[project] = {};
//             } else {
//                 times[project] = querySnapshot.data();
//             }
//         });
//         promises.push(promise);
//     }

//     await Promise.all(promises);
//     return times;
// });

// exports.getEmployeesProjects = functions.https.onCall((data, context) => {
//     const company = data.companyName;
//     const employee = data.employeeName;
//     const companyRef = db.collection("companies");
//     const projects = [];

//     return companyRef
//         .where("name", "==", company)
//         .get()
//         .then((querySnapshot) => {
//             if (querySnapshot.empty) {
//                 console.log("Company does not exist");
//                 return false;
//             } else {
//                 const doc = querySnapshot.docs[0];
//                 const projectRef = doc.ref.collection("projects");
//                 return projectRef
//                     .orderBy("workers." + employee)
//                     .get()
//                     .then((querySnapshot) => {
//                         if (querySnapshot.empty) {
//                             console.log("No projects for this employee");
//                             return false;
//                         } else {
//                             console.log("Getting projects for this employee");
//                             querySnapshot.docs.map((doc) => {
//                                 projects.push(doc.data()["name"]);
//                             });
//                         }

//                         return projects;
//                     });
//             }
//         });
// });

// exports.sendEmailToNewUser = functions.https.onCall((data, context) => {
//     const mailOptions = {
//         from: "jonah@logitnow.ca",
//         to: data.email,
//         subject: "Welcome to the company!",
//         text: `Hi ${data.name}, welcome to the company! Here is your login information: \n\nEmail: ${data.email} \nPassword: ${data.password}`,
//     };

//     return mailTransport
//         .sendMail(mailOptions)
//         .then(() => {
//             return {
//                 message: `Success! Email sent to ${data.email}`,
//             };
//         })
//         .catch((err) => {
//             return err;
//         });
// });

// exports.generatePassword = functions.https.onCall((data, context) => {
//     const password = Math.random().toString(36).slice(-8);

//     return password;
// });
