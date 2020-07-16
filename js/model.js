const model = {}
model.currentUser = undefined
model.collectionName = 'conversations'
model.currentConversation = undefined
model.conversations=undefined
model.register = (firstName, lastName, email, password) => {
  firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
    console.log(user)
    firebase.auth().currentUser.sendEmailVerification()
    firebase.auth().currentUser.updateProfile({
      displayName: firstName + ' ' + lastName
    })
    alert('Register success, please check your email!')
    view.setActiveScreen('loginScreen')
  }).catch((err) => {
    alert(err.message)
    console.log(err)
  })
}

model.login = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
    console.log(user)
    if(user.user.emailVerified) {
      model.currentUser = {
        displayName: user.user.displayName,
        email: user.user.email
      }
      view.setActiveScreen('chatScreen')
    } else {
      alert('Please verify your email!')
    }
  }).catch((err) => {
    alert(err.message)
    console.log(err)
  })
}

model.loadConversations = () => {
  firebase.firestore().collection(model.collectionName).where('users','array-contains', model.currentUser.email).get().then(res => {
    const data = utils.getDataFromDocs(res.docs)
    model.conversations = data
    if (data.length > 0) {
      model.currentConversation = data[0]
      view.showCurrentConversation()
    }
    view.showConversations()
  })
}
model.addMessage = (message) => {
  const dataToUpdate = {
    messages: firebase.firestore.FieldValue.arrayUnion(message),
  }
  firebase.firestore().collection(model.collectionName).doc(model.currentConversation.id).update(dataToUpdate)
}
model.listenConversationsChange = () => {
  let isFistRun = false
  firebase.firestore().collection(model.collectionName).where('users','array-contains', model.currentUser.email).onSnapshot((res) => {
    if(!isFistRun) {
      isFistRun = true
      return
    }
    const docChanges = res.docChanges()
    console.log(docChanges)
    for(oneChange of docChanges) {
      const type = oneChange.type
      const oneChangeData = utils.getDataFromDoc(oneChange.doc)
      if(type === 'modified') {
        if (oneChangeData.id === model.currentConversation.id) {
          if(oneChangeData.users.length===model.currentConversation.users.length){
            view.addMessage(oneChangeData.messages[oneChangeData.messages.length - 1])
          }
          else{
            //them nguoi moi
            view.addUser(oneChangeData.users[oneChangeData.users.length - 1])
          }
          model.currentConversation = oneChangeData

        }
        for(let i = 0; i < model.conversations.length; i++) {
          const element = model.conversations[i]
          if(element.id === oneChangeData.id){
            model.conversations[i] = oneChangeData
            if(oneChangeData.messages[oneChangeData.messages.length-1].owner!==model.currentUser.email){
              view.showNotify(oneChangeData.id)
            }

          }
        }
      }
      else if(type==='added'){
        model.conversations.push(oneChangeData)
        view.addConversation(oneChangeData)
        view.showNotify(oneChangeData.id)
      }
    }
  })
}
model.changeCurrentConversation = (conversationId) => {
  model.currentConversation = model.conversations.filter(item => item.id === conversationId)[0]
  console.log(model.currentConversation)
  view.showCurrentConversation()
}
model.createConversation=(conversation)=>{
  firebase.firestore().collection(model.collectionName).add(conversation)
  view.backToChatScreen()
}
model.addUser=(email)=>{
  const dataToUpdate={
    users:firebase.firestore.FieldValue.arrayUnion(email)
  }
  firebase.firestore().collection(model.collectionName).doc(model.currentConversation.id).update(dataToUpdate)
}
