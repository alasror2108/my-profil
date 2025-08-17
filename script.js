// Tambah komentar
function addComment(parentId = null) {
  const username = document.getElementById("usernameInput").value.trim();
  const input = document.getElementById("commentInput");

  if (input.value.trim() === "") return;

  // Simpan komentar ke Firebase
  firebase.database().ref("comments").push({
    name: username || "Anonim",
    text: input.value,
    parent: parentId,
    time: Date.now()
  });

  input.value = "";
}

// Render komentar & balasan
firebase.database().ref("comments").on("child_added", snapshot => {
  const data = snapshot.val();
  const list = document.getElementById("commentList");

  const comment = document.createElement("div");
  comment.className = "comment-item";

  // Format tanggal & jam
  const date = new Date(data.time);
  const formattedTime = date.toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  comment.innerHTML = `
    <strong>${data.name}</strong> <small>(${formattedTime})</small><br>
    ${data.text}
  `;

  // Tombol balas
  const replyBtn = document.createElement("button");
  replyBtn.textContent = "Balas";
  replyBtn.onclick = () => showReplyBox(snapshot.key, comment);

  comment.appendChild(replyBtn);

  if (data.parent) {
    // kalau ini balasan → cari parent
    const parent = document.querySelector(`[data-id="${data.parent}"]`);
    if (parent) {
      let replies = parent.querySelector(".replies");
      if (!replies) {
        replies = document.createElement("div");
        replies.className = "replies";
        parent.appendChild(replies);
      }
      comment.setAttribute("data-id", snapshot.key);
      replies.appendChild(comment);
    }
  } else {
    comment.setAttribute("data-id", snapshot.key);
    list.appendChild(comment);
  }
});

function showReplyBox(parentId, parentEl) {
  const replyBox = document.createElement("textarea");
  replyBox.placeholder = "Tulis balasan...";
  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Kirim Balasan";

  sendBtn.onclick = () => {
    if (replyBox.value.trim() === "") return;
    firebase.database().ref("comments").push({
      name: document.getElementById("usernameInput").value.trim() || "Anonim",
      text: replyBox.value,
      parent: parentId,
      time: Date.now()
    });
    replyBox.remove();
    sendBtn.remove();
  };

  parentEl.appendChild(replyBox);
  parentEl.appendChild(sendBtn);
}

// Musik
function toggleMusic() {
  const music = document.getElementById("bg-music");
  const btn = document.getElementById("musicToggle");

  music.muted = false;

  if (music.paused) {
    music.play();
    btn.textContent = "🔊";
  } else {
    music.pause();
    btn.textContent = "🔇";
  }
}
