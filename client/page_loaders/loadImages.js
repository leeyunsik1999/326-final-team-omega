export function loadImagesPage(page) {
    console.log("loadImagesPage");
    const imagePage = document.createElement("div");
    imagePage.id = "pictures-page"
    imagePage.classList.add("page");

    imagePage.appendChild(loadLogo());
    imagePage.appendChild(createGallery());

    page.appendChild(imagePage);
}

function loadLogo() {
  const logo = document.createElement("img");
  logo.classList.add("photo-image");
  logo.src = "./images/pictures_logo.png";
  logo.alt = "logo";
  logo.id = "picture-page-logo";

  return logo;
}

function createGallery() {
  const gallery = document.createElement("div");
  gallery.classList.add("container", "gallery-container");
  gallery.appendChild(createGalleryRow());

  return gallery;
}

function createGalleryRow() {
  const row = document.createElement("div");
  row.id = "gallery-row";
  row.classList.add("row");

  for (let i = 0; i < 4; i++) {
    row.appendChild(createGalleryColumn());
  }

  return row;
}

function createGalleryColumn() {
  const column = document.createElement("div");
  column.id = "gallery-column";
  column.classList.add("column");

  for (let i = 1; i < 6; i++) {
    column.appendChild(loadImage(i));
  }

  return column;
}


function loadImage(picNum) {
  const lightBox = document.createElement("a");

  // Hack around the 2nd picture being a png.
  let imgPath = "./images/pic" + picNum + ".jpg";
  if (picNum === 2) {
    imgPath = "./images/pic" + picNum + ".png";
  }

  lightBox.classList.add("lightbox");
  lightBox.setAttribute("href", imgPath);

  const image = document.createElement("img");
  image.src = imgPath;
  image.alt = "pic" + picNum;
  image.id = "pic" + picNum;
  image.classList.add("pic");

  lightBox.appendChild(image);

  return lightBox;
}

