function updateCounter() {

  const text =
    document.getElementById("inputText").value;

  document.getElementById("charCount").innerText =
    text.length;
}

function showLoader(){

  const output =
    document.getElementById("outputText");

  let dots = 0;

  output.value = "AI is thinking";

  const interval = setInterval(()=>{

    dots++;

    output.value =
      "AI is thinking" + ".".repeat(dots);

    if(dots === 3){
      dots = 0;
    }

  },500);

  window.loaderInterval = interval;
}

async function translateText() {

  const text =
    document.getElementById("inputText").value;

  const source =
    document.getElementById("sourceLang").value;

  const target =
    document.getElementById("targetLang").value;

  const output =
    document.getElementById("outputText");

  if (text.trim() === "") {

    alert("Please enter text");

    return;
  }

  let actualSource = source;
  let actualTarget = target;

  if(source === "hinglish"){
    actualSource = "hi";
  }

  if(target === "hinglish"){
    actualTarget = "hi";
  }

  showLoader();

  try {

    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${actualSource}|${actualTarget}`;

    const response = await fetch(url);

    const data = await response.json();

    clearInterval(window.loaderInterval);

    const translated =
      data.responseData.translatedText;

    let finalText = translated;

    if(target === "hinglish"){

      finalText =
        convertToHinglish(translated);
    }

    typeEffect(finalText);

  }

  catch (error) {

    output.value =
      "Translation failed";
  }
}

function typeEffect(text) {

  const output =
    document.getElementById("outputText");

  output.value = "";

  let index = 0;

  const typing = setInterval(() => {

    output.value += text[index];

    index++;

    if (index >= text.length) {

      clearInterval(typing);
    }

  }, 20);
}

function copyText() {

  const output =
    document.getElementById("outputText");

  navigator.clipboard.writeText(
    output.value
  );

  alert("Copied Successfully");
}

function speakText() {

  const text =
    document.getElementById("outputText").value;

  const speech =
    new SpeechSynthesisUtterance(text);

  window.speechSynthesis.speak(speech);
}

function swapLanguages() {

  const source =
    document.getElementById("sourceLang");

  const target =
    document.getElementById("targetLang");

  let temp = source.value;

  source.value = target.value;

  target.value = temp;
}

function startVoice() {

  if (
    !window.SpeechRecognition &&
    !window.webkitSpeechRecognition
  ) {

    alert(
      "Speech Recognition not supported"
    );

    return;
  }

  const recognition =
    new (
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    )();

  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = function(event){

    document.getElementById(
      "inputText"
    ).value =
      event.results[0][0].transcript;

    updateCounter();
  };
}

function toggleTheme(){

  document.body.classList.toggle(
    "light-mode"
  );
}

function convertToHinglish(text){

  const words = {

    "नमस्ते":"namaste",
    "आप":"aap",
    "कैसे":"kaise",
    "हो":"ho",
    "धन्यवाद":"dhanyavaad",
    "मेरा":"mera",
    "नाम":"naam",
    "क्या":"kya",
    "है":"hai",
    "मैं":"main"

  };

  let result = text;

  for(let key in words){

    result =
      result.replaceAll(key, words[key]);
  }

  return result;
}