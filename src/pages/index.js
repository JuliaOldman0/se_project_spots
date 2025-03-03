import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";

import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import penIcon from "../images/pen.svg";
import pencilIcon from "../images/pen_light.svg";
import plusIcon from "../images/plus_sign.svg";

import Api from "../utils/Api.js";


document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__avatar").src = avatar;
document.querySelector(".profile__pencil-icon").src = pencilIcon;
document.querySelector(".profile__edit-btn img").src = penIcon;
document.querySelector(".profile__add-btn img").src = plusIcon;

document.querySelector(".footer__copyrights").textContent = 
  `${new Date().getFullYear()} © Spots`;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "15d20bab-3906-48d9-b03a-14f860add378",
    "Content-Type": "application/json",
  },
});

const cardsList = document.querySelector(".cards__list");

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    document.querySelector(".profile__avatar").src = userInfo.avatar;
    document.querySelector(".profile__name").textContent = userInfo.name;
    document.querySelector(".profile__description").textContent =
      userInfo.about;
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const modals = document.querySelectorAll(".modal");
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".delete__form");
const cancelButton = deleteModal.querySelector(".modal__cancel-btn");
const closeButton = deleteModal.querySelector(".modal__close-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

let selectedCard;
let selectedCardId;

const cardTemplate = document.querySelector("#card-template");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  // Set card details
  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_liked");
  }

  function handleLike(evt, id) {
    const likeButton = evt.target;
    const isLiked = likeButton.classList.contains("card__like-button_liked");
    api
      .changeLikeStatus(id, isLiked)
      .then(() => {
        likeButton.classList.toggle("card__like-button_liked"); 
      })
      .catch(console.error);
  }

function handleImagePreview(data) {
  previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
    openModal(previewModal);
} 

cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
cardDeleteBtn.addEventListener("click", () => {
  handleDeleteCard(cardElement, data._id);
});

cardImageEl.addEventListener("click", () => handleImagePreview(data));
  return cardElement;
}

// List of modals and their close buttons
const modalCloseButtons = [
  { button: previewCloseBtn, modal: previewModal },
  { button: closeButton, modal: deleteModal },
  { button: cancelButton, modal: deleteModal },
  { button: editModalCloseButton, modal: editModal },
  { button: cardModalCloseBtn, modal: cardModal },
  { button: avatarModalCloseBtn, modal: avatarModal },
];

// Attach event listeners dynamically
modalCloseButtons.forEach(({ button, modal }) => {
  button.addEventListener("click", () => closeModal(modal));
});

// Open modal event listeners
cardModalButton.addEventListener("click", () => openModal(cardModal));
avatarModalButton.addEventListener("click", () => openModal(avatarModal));


function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKeyPress);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKeyPress);
}

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

const handleEscapeKeyPress = (event) => {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
};

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addNewCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement); 
      evt.target.reset(); 
      disableButton(cardSubmitBtn, settings); 
      closeModal(cardModal); 
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);




enableValidation(settings);
