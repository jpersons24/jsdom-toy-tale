let addToy = false;


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  loadToys()

});


// **************** GLOBAL SCOPE BEGINS HERE *******************


// ******************* render toys from database to DOM **************************

function loadToys() {
  const toysUrl = 'http://localhost:3000/toys'
  fetch(toysUrl)
  .then(response => response.json())
  .then(data => {
    data.forEach(toyObj => renderToy(toyObj))
  })
}

const collectionDiv = document.querySelector('#toy-collection')

function renderToy(toyObj) {
  const toyDiv = document.createElement('div')
  toyDiv.classList.add('card')
  toyDiv.dataset.id = toyObj.id
  collectionDiv.append(toyDiv)

  const toyName = document.createElement('h2')
  toyName.classList.add('toy-name')
  toyName.innerText = toyObj.name

  const toyImg = document.createElement('img')
  toyImg.classList.add('toy-avatar')
  toyImg.src = toyObj.image
  toyImg.alt = `Photo of ${toyObj.name}!`

  const toyLikes = document.createElement('p')
  toyLikes.classList.add('toy-likes')
  toyLikes.dataset.likes = toyObj.likes
  toyLikes.innerText = toyObj.likes


  const likeBtn = document.createElement('button')
  likeBtn.classList.add('like-btn')

  likeBtn.textContent = 'Like!'
  likeBtn.dataset.id = 'likes'
  toyDiv.append(toyName, toyImg, toyLikes, likeBtn)
  // toyDiv.appendChild(toyName)
  // toyDiv.appendChild(toyImg)
  // toyDiv.appendChild(toyLikes)
  // toyDiv.appendChild(likeBtn)
}


// ******************** new toy form submission *********************

const toyForm = document.querySelector('.add-toy-form')

toyForm.addEventListener('submit', handleToyFormSubmit)

function handleToyFormSubmit(event) {
  event.preventDefault

  const newToyObj = { 
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newToyObj),
  })
    .then(response => response.json())
    .then(newToyObj => {
      renderToy(newToyObject)
      console.log('Post request success!', newToyObj);
    })
  .catch((error) => {
    console.error('Error:', error);
  });

}



// ******************* like button ******************


// listen for even on toy collection div, delegating using the increaseLikes function
collectionDiv.addEventListener('click', function(event) {
  console.log(event.target)
  increaseLikes(event)
})


function increaseLikes(event) {

  if (event.target.matches('.like-btn')){
  
    // find current like value
    const pTag = event.target.parentElement.querySelector('p.toy-likes')
    let currLikes = parseInt(pTag.innerText)

    // increase current value by 1
    let newLikes = currLikes + 1

    // add new value to DOM
    pTag.innerText = newLikes
    pTag.dataset.likes = newLikes

    // send patch request
    const likesObj = {likes: newLikes}
    const toyId = pTag.parentElement.dataset.id

    updateToyInDatabase(toyId, likesObj)
  }
}

function updateToyInDatabase(id, updatedObj){

  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(updatedObj),
  })
}



