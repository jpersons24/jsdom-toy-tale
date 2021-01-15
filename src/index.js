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
  // addingToy()
});


// **************** GLOBAL SCOPE BEGINS HERE *******************

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
      console.log('Success:', newToyObj);
    })
  .catch((error) => {
    console.error('Error:', error);
  });

}



// ******************* like button *******************

const likeButton = document.querySelector('.like-btn')

likeButton.addEventListener('click', function(event){
  if (event.target.dataset.id === 'likes') {
    // Update Animal
    // PATCH /animals/:id
    // body: { donation: 10 }
    const button = event.target
    // traverse the DOM to find elements we care about, relative to the button
    const card = button.closest(".card")
    const id = card.dataset.id
    // traverse the DOM to find elements we care about, relative to the button
    const likeP = card.querySelector(".toy-likes")
    // get the donation amount from the DOM
    const likeCount = parseInt(likeP.textContent)
     // optimistic rendering!
     // donationCountSpan.textContent = donationCount + 10 
    fetch(`http://localhost:3000/toys${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likes: likeCount + 1
      }),
    })
      .then(response => response.json())
      .then(updatedToy => {
        console.log('Success:', updateToy);
        // update the DOM
        // pessimistic rendering!
        likeP.textContent = updatedToy.likes
      })
  }
})




