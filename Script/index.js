// Api Main Variable
const Api_Key = "ifqrJVs7F6Abl0RsgbaO0hciGVcpngAWra3ftOaHGTDfXEWYv13DgVLD";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

// DOM Elements
const imagesWrapper = document.querySelector(".images");
const LoadMore = document.querySelector(".load_more_btn");
const SearchInput = document.querySelector(".search_Input");
const SearchIcon = document.querySelector("#Search_ID");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downLoadImgBtn = document.querySelector(".uil-import");

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(file);
        a.download = new Date().getTime();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }).catch(() => alert("Failed to download Image!"));
}

const showLightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
    downLoadImgBtn.setAttribute("data-img", img)
}

const HideLightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img => 
        `
        <li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="Image">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>
        `
    ).join("");
}

const getImages = (apiURL) => {
    LoadMore.innerText = "Loading...";
    LoadMore.classList.add("disabled");
    fetch(apiURL, {
        headers: {
            Authorization: Api_Key
        }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        LoadMore.innerText = "Load More";
        LoadMore.classList.remove("disabled");
    }).catch(() =>alert("Failed to load images!"))
}

const LoadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`: apiURL;
    getImages(apiURL);
}

const LoadSearchImages = (e) => {
    if(e.target.value === "") return searchTerm = null;

    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        let searchURL = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;
        getImages(searchURL);
    } 
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
LoadMore.addEventListener("click", LoadMoreImages)
SearchInput.addEventListener("keyup", LoadSearchImages)
closeBtn.addEventListener("click", HideLightBox)
downLoadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img))

