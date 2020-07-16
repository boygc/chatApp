// window.onload=()=>{
//     console.log("load")
//     view.setActiveScreen('registerScreen')
// }
window.onload=()=>{
    var firebaseConfig = {
      apiKey: "AIzaSyBZimKNYiqUpyHBag_SekD_I-DJgTjGOew",
      authDomain: "chat-e15be.firebaseapp.com",
      databaseURL: "https://chat-e15be.firebaseio.com",
      projectId: "chat-e15be",
      storageBucket: "chat-e15be.appspot.com",
      messagingSenderId: "826526645496",
      appId: "1:826526645496:web:ee1af0d1060b4209de0f0d",
      measurementId: "G-JNPNFTG8QP"
    };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig)
 // templateQueryDatabase()
 firebase.auth().onAuthStateChanged((user) => {
   // console.log(user)
   if(user) {
     if (user.emailVerified) {
       model.currentUser = {
         displayName: user.displayName,
         email: user.email
       }
       view.setActiveScreen('chatScreen')
     } else {
       view.setActiveScreen('loginScreen')
       alert('Please verify your email')
     }
   } else {
     view.setActiveScreen('loginScreen')
   }
 })
}

templateQueryDatabase = () => {
 const docId = 'tWCAawI6PiKYTjGqzkQa'
 // get one
 firebase.firestore().collection('users').doc(docId).get().then(res => {
   console.log(getDataFromDoc(res))
 }).catch(err => {
   console.log(err)
 })
 // get many
 firebase.firestore().collection('users').where('age','==',20).get().then(res => {
   console.log(res)
   // console.log(getDataFromDoc(res.docs[0]))
   console.log(getDataFromDocs(res.docs))
 })

 // create
 const dataToCreate = {
   name: 'Create',
   age: 18,
   email: 'khiemnb2@gmail.com',
   phoneNumber: ['0123123123']
 }
 // firebase.firestore().collection('users').add(dataToCreate).then(res => {
 //   alert('Added!')
 // })
 // update
   const docIdUpdate = '4inNoaCGHdmeajDDphBM'
   const dataToUpdate = {
     age: 20,
     address: 'HN',
     phones: firebase.firestore.FieldValue.arrayUnion('0123345121233')
   }
   firebase.firestore().collection('users').doc(docIdUpdate).update(dataToUpdate).then(res => {
     // alert('Updated!')
   })
 // delete
   // const docIdDelete = 'TDcT8KuN776GPZoCqamU'
   // firebase.firestore().collection('users').doc(docIdDelete).delete().then(res => {
   //   // alert('Deleted!')
   // })
}