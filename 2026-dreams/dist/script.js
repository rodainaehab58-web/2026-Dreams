document.getElementsByTagName("h1")[0].style.fontSize = "6vw";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGmurYc37WQPVO5yFMbM8dKE6Ae5AgJG0",
  authDomain: "dreams-a732c.firebaseapp.com",
  databaseURL: "https://dreams-a732c-default-rtdb.firebaseio.com",
  projectId: "dreams-a732c",
  storageBucket: "dreams-a732c.appspot.com",
  messagingSenderId: "379240447174",
  appId: "1:379240447174:web:91580a679dc5511dfa2bc7",
  measurementId: "G-PSLETP5GSH"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// شطب النوتس
const notes = document.querySelectorAll('.sticky-note');

// جلب البيانات من LocalStorage أولًا
let savedNotes = JSON.parse(localStorage.getItem('dreams')) || {};

notes.forEach((note, index) => {
    if (!note.id) note.id = `dream-${index}`;
    const dreamId = note.id;

    // 1️⃣ لو موجود في LocalStorage، نطبق الشطب فورًا
    if (savedNotes[dreamId]) note.classList.add('done');

    // 2️⃣ جلب الحالة من Firebase لو LocalStorage فاضي أو لتأكيد Live
    db.ref('dreams/' + dreamId).once('value').then(snapshot => {
        const firebaseDone = snapshot.val();
        if (firebaseDone) {
            note.classList.add('done');
            savedNotes[dreamId] = true; // مزامنة مع LocalStorage
            localStorage.setItem('dreams', JSON.stringify(savedNotes));
        }
    });

    // 3️⃣ عند الضغط على النوتة
    note.addEventListener('click', () => {
        note.classList.toggle('done');
        const isDone = note.classList.contains('done');

        // حفظ على LocalStorage فورًا
        savedNotes[dreamId] = isDone;
        localStorage.setItem('dreams', JSON.stringify(savedNotes));

        // مزامنة على Firebase
        db.ref('dreams/' + dreamId).set(isDone);
    });
});