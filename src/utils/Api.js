class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _fetch(endpoint, options = {}) {
    return fetch(`${this._baseUrl}${endpoint}`, {
      headers: this._headers,
      ...options,
    }).then((res) =>
      res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    );
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getInitialCards() {
    return this._fetch("/cards");
  }

  addNewCard(cardData) {
    return this._fetch("/cards", {
      method: "POST",
      body: JSON.stringify(cardData),
    });
  }

  getUserInfo() {
    return this._fetch("/users/me");
  }

  editUserInfo(data) {
    return this._fetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  editAvatarInfo(avatar) {
    return this._fetch("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  deleteCard(id) {
    return this._fetch(`/cards/${id}`, { method: "DELETE" });
  }

  changeLikeStatus(id, isLiked) {
    return this._fetch(`/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
    });
  }
}

export default Api;
