export async function loadImagesPage(page) {
    console.log("loadImagesPage");
    const imagePage = document.createElement("div");
    imagePage.id = "pictures-page"
    imagePage.classList.add("page");

    imagePage.appendChild(loadLogo());
    const gallery = await createGallery();
    imagePage.appendChild(gallery);

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

async function createGallery() {
  const gallery = document.createElement("div");
  gallery.classList.add("container", "gallery-container");

  const details = await getUserImages();

  gallery.appendChild(createGalleryRow(details));

  return gallery;
}

function createGalleryRow(details) {
  const row = document.createElement("div");
  row.id = "gallery-row";
  row.classList.add("row");

  let numColumns = details.length;
  if (numColumns > 4) { // Truncate to 4 columns if more than 4 images
    numColumns = 4;
  }

  for (let i = 0; i < numColumns; i++) {
    row.appendChild(createGalleryColumn(details));
  }

  for (let i = 0; i < details.length; i++) {
    row.childNodes[i % numColumns].appendChild(loadImage(details[i]));
  }

  return row;
}

function createGalleryColumn(details) {
  const column = document.createElement("div");
  column.id = "gallery-column";
  column.classList.add("column");

  return column;
}


function loadImage(detail) {
  const lightBox = document.createElement("a");
  const path = "." + detail["path"].substr(9); // remove "../client" For some reason the path is not correct.

  lightBox.classList.add("lightbox");
  lightBox.setAttribute("href", path);

  const image = document.createElement("img");
  image.src = path;
  image.alt = detail["caption"];
  image.id = detail["_id"];
  image.classList.add("pic");

  lightBox.appendChild(image);

  return lightBox;
}

// Get request to server to get all images for the user
async function getUserImages() {
  try {
    const response = await fetch(`${window.requestName}/${window.user_name}/images/details`);
    const data = await response.json();
    return data["images"];
  } catch (error) {
    console.log(error);
  }
}
