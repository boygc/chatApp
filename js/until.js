const utils = {}
utils.getDataFromDoc = (doc) => {
  const data = doc.data()
  data.id = doc.id
  return data
}
utils.getDataFromDocs = (docs) => {
  return docs.map(utils.getDataFromDoc)
}