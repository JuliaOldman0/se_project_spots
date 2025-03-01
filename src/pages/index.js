import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import penIcon from "../images/pen.svg";
import plusIcon from "../images/plus_sign.svg";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__avatar").src = avatar;
document.querySelector(".profile__edit-btn img").src = penIcon;
document.querySelector(".profile__add-btn img").src = plusIcon;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "15d20bab-3906-48d9-b03a-14f860add378",
    "Content-Type": "application/json",
  },
});

api
  .getInitialCards()
  .then(({ cards, userInfo }) => {
    setUserInfo(userInfo);
    renderCards(cards);
  })
  .catch(console.error);

// Function to set user information
function setUserInfo(userInfo) {
  document.querySelector(".profile__avatar").src = userInfo.avatar;
  document.querySelector(".profile__name").textContent = userInfo.name;
  document.querySelector(".profile__description").textContent = userInfo.about;
}

function renderCards(cards) {
  const fragment = document.createDocumentFragment();
  cards.forEach((item) => {
    fragment.append(getCardElement(item));
  });
  cardsList.append(fragment);
}

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAvatar = document.querySelector(".profile__avatar");
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

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

let selectedCard, selectedCardId;

const cardTemplate = document.querySelector("#card-template");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  const cardsList = document.querySelector(".cards__list");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });
  
  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModal);
  });
  
  cardDeleteBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    handleDeleteCard(cardElement, data);
  });
  
  return cardElement;
}

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

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

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCard({
      name: document.querySelector("#add-card-name-input").value,
      link: document.querySelector("#add-card-link-input").value,
    })
    .then((newCard) => {
      cardsList.prepend(getCardElement(newCard));
      evt.target.reset();
      disableButton(submitBtn, settings);
      closeModal(document.querySelector("#add-card-modal"));
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

function setupModalToggle(button, modal, action) {
  button.addEventListener("click", () => {
    action === "open" ? openModal(modal) : closeModal(modal);
  });
}

// Open buttons
setupModalToggle(cardModalButton, cardModal, "open");
setupModalToggle(avatarModalButton, avatarModal, "open");

// Close buttons
setupModalToggle(editModalCloseButton, editModal, "close");
setupModalToggle(cardModalCloseBtn, cardModal, "close");
setupModalToggle(avatarModalCloseBtn, avatarModal, "close");


avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatar(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);

      profileAvatar.src = data.avatar;

      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  api
    .deleteCard(selectedCardId)
    .then(() => {
      const cardElement = document.querySelector(
        `[data-id='${selectedCardId}']`
      );
      if (cardElement) {
        cardElement.remove();
      }

      closeModal(deleteModal);
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardData._id;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  const cardLikeBtn = evt.target;
  const cardElement = cardLikeBtn.closest(".card");

  const isLiked = cardLikeBtn.classList.contains("card__like-button_liked");

  api
    .changeLikeStatus(id, !isLiked)
    .then((updatedCard) => {
      likeCountElement.textContent = updatedCard.likes.length || "";
      cardLikeBtn.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
cardDeleteBtn.addEventListener("click", () => handleDeleteCard(cardElement, data._id));


editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
