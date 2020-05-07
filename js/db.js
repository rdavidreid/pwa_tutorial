// real-time listener
db.collection('recipes').onSnapshot(snapshot => {
  //console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    //console.log(change.type, change.doc.id, change.doc.data());
    if(change.type === 'added'){
      // add the document data to the web page
      renderRecipe(change.doc.data(), change.doc.id)
    }
    if(change.type === 'removed'){
      // remove the document data from the web page
    }
  });
}); 