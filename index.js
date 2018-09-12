let allTheHotels

let wishListFilter = false
const wishListFilterButton = document.querySelector('#wish-list-filter')

document.addEventListener('DOMContentLoaded', function () {
  getCroppedData()

  wishListFilterButton.addEventListener('click', event => {
    wishListFilter = !wishListFilter
    wishListFilterButton.innerHTML = `Show Hotels in Wish List <br> ${wishListFilter ? 'ON' : 'OFF'}`

    if (wishListFilter) {
      removeListPanelImages()
      getAndShowWishlistedHotelsInSidebar()
    } else {
      removeListPanelImages()
      showCroppedImages(allTheHotels)
    }
  })
})

function getCroppedData () {
  return fetch('http://localhost:3000/hotels')
    .then(res => res.json())
    .then(data => {
      allTheHotels = data
      showCroppedImages(allTheHotels)
    })
}

// showCroppedImages(wishlistedHotels)

function showCroppedImages (imageDatas) {
  imageDatas.forEach(cropped_image => {
    showCroppedImage(cropped_image)
  })
}

function showCroppedImage (croppedImageData) {
  const sideBar = document.querySelector('#images')
  const div = document.createElement('div')
  const imageEl = document.createElement('img')
  imageEl.src = croppedImageData.cropped_image
  imageEl.height = '160'
  imageEl.width = '160'

  div.append(imageEl)
  sideBar.append(div)

  imageEl.addEventListener('click', e => {
    removeSelectedImage()
    showSelectedImage(croppedImageData)
  })
}

function showSelectedImage (fullImageData) {
  const mainScreen = document.querySelector('#show-panel')
  const imageEl = document.createElement('img')
  imageEl.src = fullImageData.full_image

  const infoEl = document.createElement('h2')
  infoEl.innerText = `${fullImageData.name}, ${fullImageData.city}, ${fullImageData.country}`

  const websiteEl = document.createElement('a')
  websiteEl.href = 'http://' + fullImageData.website
  websiteEl.innerText = fullImageData.website

  const wishListButton = document.createElement('button')
  wishListButton.innerText = hotelIsWishlisted(fullImageData) ? 'Remove from Wish List' : 'Add to Wish List'

  const breakEl = document.createElement('br')
  const breakEl2 = document.createElement('br')

  mainScreen.append(imageEl)
  mainScreen.append(infoEl)
  mainScreen.append(websiteEl)
  mainScreen.append(breakEl)
  mainScreen.append(breakEl2)
  mainScreen.append(wishListButton)

  wishListButton.addEventListener('click', event => {
    if (hotelIsWishlisted(fullImageData)) {
      currentUser.likedHotels = currentUser.likedHotels.filter(hotel => hotel.id !== fullImageData.id)
      removeFromWishList(currentUser.id, fullImageData.id)
        .then(() => {
          removeListPanelImages()
          getAndShowWishlistedHotelsInSidebar()
        })
    } else {
      currentUser.likedHotels.push(fullImageData)
      addToWishList(currentUser.id, fullImageData.id)
    }
    wishListButton.innerText = `${hotelIsWishlisted(fullImageData) ? 'Remove from Wish List' : 'Add to Wish List'}`
  })
}

function getAndShowWishlistedHotelsInSidebar () {
  fetch(`http://localhost:3000/users/${currentUser.id}/liked_hotels`)
    .then(res => res.json())
    .then(data => showCroppedImages(data.likedHotels))
}

function hotelIsWishlisted (hotel) {
  return currentUser.likedHotels.map(h => h.id).includes(hotel.id)
}

function removeSelectedImage () {
  const mainScreen = document.querySelector('#show-panel')
  const children = [...mainScreen.children]
  children.forEach(child => child.remove())
}

function removeListPanelImages () {
  const listPanel = document.querySelector('#images')
  const children = [...listPanel.children]
  children.forEach(child => child.remove())
}

function addToWishList (user_id, hotel_id) {
  return fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({user_id: user_id, hotel_id: hotel_id})
  })
}
function removeFromWishList (user_id, hotel_id) {
  return fetch('http://localhost:3000/remove', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({user_id, hotel_id})
  })
}
