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
      removeRecipe(change.doc.id)
    }
  });
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', event => {
  event.preventDefault();
  
  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  };

  db.collection('recipes').add(recipe)
    .catch(err => console.log(err));

  form.title.value = '';
  form.ingredients.value = '';
});

// delete recipe
const recipeContainer = document.querySelector('.recipes')
recipeContainer.addEventListener('click', (event) => {
  // console.log(event)
  if (event.target.tagName === 'I') {
   const id = event.target.getAttribute('data-id')
   db.collection('recipes').doc(id).delete()
  }
})