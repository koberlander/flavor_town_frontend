document.addEventListener('DOMContentLoaded', function(){
// load DOM elements
  const newOrderBtn = document.getElementById('hiddenButton')
  const orderForm = getOrderForm()
// add Event Listeners
  orderForm.addEventListener('submit', submitOrder)

  newOrderBtn.addEventListener('click', toggleOrderForm)

  debugger

  loadFlavors()
  addFlavorsToForm()
})


// Helper Functions
function getOrderForm(){
 return document.getElementById('order-form')
}

let newOrder = false

function toggleOrderForm(){
  newOrder = !newOrder
  let orderForm = getOrderForm()

  if (newOrder) {
    orderForm.style.display = 'block'
  } else {
    orderForm.style.display = 'none'
  }

}

function loadFlavors(){

  fetch('http://localhost:3000/api/v1/flavors')
  .then(res => res.json())
  .then(json => {
    json.forEach(flavor => {
      // Create new element for ice cream card
      let columnDiv = document.createElement('div')
      columnDiv.className = 'col-3'

      let cardDiv = document.createElement('div')
      cardDiv.className = 'card'

      // Add flavor object (name, description, image) attributes to card as new elements
      let picture = document.createElement('img')
      picture.className = 'card-image-top'
      picture.src = flavor.img

      let name = document.createElement('h4')
      name.innerText = flavor.name

      let description = document.createElement('p')
      description.className = 'ice-cream-p-tag'
      description.innerText = flavor.description

      // Append flavor card to page
        cardDiv.append(picture, name, description)

        columnDiv.appendChild(cardDiv)

        let addToFlavorDiv = document.getElementById('flavor-div')
        addToFlavorDiv.appendChild(columnDiv)

    })
  })
}

function addFlavorsToForm(){
  fetch('http://localhost:3000/api/v1/flavors')
  .then(res => res.json())
  .then(json => {
    json.forEach(flavor => {

      // create form-check
      let formCheck = document.createElement('div')
      formCheck.className = 'form-check'

      // create form input and label
      let checkBoxInput = document.createElement('input')
      checkBoxInput.type = 'checkbox'
      checkBoxInput.className = 'form-check-input'
      checkBoxInput.dataset.id = flavor.id


      let checkBoxLabel = document.createElement('label')
      checkBoxLabel.className = 'form-check-label'
      checkBoxLabel.innerText = flavor.name

      // append input and label to form-check
      formCheck.append(checkBoxInput, checkBoxLabel)

      // append form-check to form-group with id=box-container
      let formGroupContainer = document.getElementById('box-container')
      formGroupContainer.append(formCheck)
    })
  })
}


function getFlavorIds(){
  // find elements with a class name of form-check-input
    let flavorIds = []
    let flavorArray = document.querySelectorAll('.form-check-input')
    flavorArray.forEach(flavor => {
      if (flavor.checked){
        flavorIds.push(flavor.dataset.id)
        }
    })
    return flavorIds
}

// when a user clicks submit, make a post fetch to api and save the new orderForm
// let user know that their order has been submitted by resetting form
function submitOrder(event){
  event.preventDefault()

  // assign form to a variable for reset later
    let orderForm = getOrderForm()

  // find full name
    let fullNameInput = document.getElementById('name')

  // find address input
    let addressInput = document.getElementById('address')

  fetch('http://localhost:3000/api/v1/orders', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order: {
      name: fullNameInput.value,
      address: addressInput.value,
      flavor_ids: getFlavorIds(),
      }
    })
  }).then(res => res.json()).then(json => {
        // updateOrderForm(json)
        toggleOrderForm()

        renderOrderDetails(json)

      })
}

function renderOrderDetails(json){
  let showOrderDiv = document.getElementById('show-order-div')

  let title = document.createElement('h2')
  title.innerText = 'Order Details'


  let nameAddress = document.createElement('p')
  nameAddress.innerHTML = `${json.name}, ${json.address}`

  let flavorsList = document.createElement('ul')
  json.flavors.forEach(flavor => {
      let listItem = document.createElement('li')
      listItem.innerText = flavor.name
      flavorsList.append(listItem)
  })
  let editBtn = document.createElement('button')
  editBtn.innerText = 'Update Order'
  editBtn.addEventListener('click', event => {
    toggleOrderForm()
    toggleOrderDetails()
  })

  showOrderDiv.append(title, nameAddress, flavorsList, editBtn)
}

function toggleOrderDetails(){
  let showOrderDiv = document.getElementById('show-order-div')
  debugger
  showOrderDiv.innerHTML = ''
}

// DOM manipulation
function updateOrderForm(json){


  // Remove the submit event listener currently on the form
  let orderForm = getOrderForm()
  orderForm.removeEventListener('submit', submitOrder, false)
  // Add a new submit event listener to the form (updateOrder)
  orderForm.addEventListener('submit', event => {
    updateOrder(event).then(renderOrderDetails)
    updateOrderForm(json)
    toggleOrderForm()
  })

  // Save the order id somewhere on the form
  orderForm.dataset.id = json.id

  // Change the the Submit button on the form to say "Update Order"
  let updateOrderBtn = orderForm.querySelector('button')
  updateOrderBtn.innerText = 'Update Order'
}

// Fetch to backend
function updateOrder (e){
  e.preventDefault()
  let orderForm = document.getElementById('order-form')

  let name = document.getElementById('name')
  let address = document.getElementById('address')

  let flavorArray = getFlavorIds()

  // patch/update order by id
  return fetch(`http://localhost:3000/api/v1/orders/${orderForm.dataset.id}`, {
    method: 'PATCH',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: name.value,
      address: address.value,
      flavor_ids: flavorArray,
    }),
  }).then(res => res.json())

}
