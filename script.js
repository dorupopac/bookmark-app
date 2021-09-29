const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show Modal, Focus on Input
const showModal = () => {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
};

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () =>
  modal.classList.remove('show-modal')
);
modal.addEventListener('click', function (e) {
  if (!e.target.closest('.modal')) modal.classList.remove('show-modal');
});

// Validate Form
const validate = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please fill out both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }
  return true;
};

// Build Bookmarks DOM
const buildBookmarks = () => {
  // Remove all bookmark elements
  bookmarksContainer.innerHTML = '';
  // Build bookmarks
  Object.keys(bookmarks).forEach(id => {
    const { name, url } = bookmarks[id];
    const html = `
      <div class="item">
        <i class="fas fa-times" id="delete-bookmark" title="Delete Bookmark"></i>
        <div class="name">
          <img src="https://s2.googleusercontent.com/s2/favicons?domain=${url}" alt="Favicon">
          <a href="${url}" target="_blank">${name}</a>
        </div>
      </div>
    `;

    bookmarksContainer.insertAdjacentHTML('afterbegin', html);
    const deleteBookmarkEl = document.getElementById('delete-bookmark');
    deleteBookmarkEl.addEventListener('click', () => deleteBookmark(url));
  });
};

// Fetch bookmarks from localStorage
const fetchBookmarks = () => {
  // Check localstorage and retrieve items
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // Create bookmarks arr in localstorage
    const url = 'https://doru-bookmarks.netlify.app';
    bookmarks[url] = {
      name: 'Name of website',
      url: 'https://doru-bookmarks.netlify.app',
    };

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
};

// Delete Bookmark
const deleteBookmark = url => {
  if (bookmarks[url]) delete bookmarks[url];

  // Update bookmarks array in localstorage, repopulate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
};

// Handle Data from Form
const storeBookmark = e => {
  e.preventDefault();

  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) return;
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  console.log(bookmarks);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, get bookmarks from localstorage
fetchBookmarks();
