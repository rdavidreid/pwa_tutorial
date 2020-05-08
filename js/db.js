// enable offline data
db.enablePersistence()
  .catch(function(error) {
    if (error.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (error.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });

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