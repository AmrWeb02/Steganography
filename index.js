const encodeBtn = document.getElementById("encode");
const decodeBtn = document.getElementById("decode");
const uploadBtn = document.getElementById("fileUpload");
const txt = document.getElementById("msg");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d",{ willReadFrequently: true });
const image = new Image();

encodeBtn.addEventListener("click",encode);
decodeBtn.addEventListener("click",decode);
uploadBtn.addEventListener("change",workTime);

function workTime(event){
    const reader = new FileReader();
    console.log(event);
    console.log(event.target);
    console.log(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
    console.log(reader);
    reader.onload = function (e){
        console.log(e);
        image.src = e.target.result;
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
          };
    }
}
function encode(){
    if(txt.value.length===0){
        alert("Please enter the message you want to hide!");
        return; 
    }
    else{
        const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        const data = imageData.data;
        console.log(imageData);
        console.log(data);
        let binaryText="";
        for(let i=0; i<txt.value.length;i++){
            let binaryChar = txt.value.charCodeAt(i).toString(2).padStart(8, "0");
            binaryText += binaryChar;
        }
        binaryText = binaryText + "00000000";

          
        for(let i=0; i<binaryText.length; i++){
            data[i * 4 +2] = (data[i * 4+2] & 0b11111110) | parseInt(binaryText[i]);
        }
        ctx.putImageData(imageData, 0, 0);
        const outputImage = document.getElementById("encodedImage");
        outputImage.src = canvas.toDataURL();
    }

  
}
function decode() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    let binaryText = "";
    let decodedText = "";
  
    // Extract binary data from the image
    for (let i = 0; i < data.length; i += 4) {
      binaryText += (data[i+2] & 1).toString();
    }
  
    // Convert binary data back to characters
    for (let i = 0; i < binaryText.length; i += 8) {
      let byte = binaryText.slice(i, i + 8);
      if (byte.length < 8) break; // Stop if the byte is incomplete
      let charCode = parseInt(byte, 2);
      if (charCode === 0) break; // Stop if we hit a null character
      decodedText += String.fromCharCode(charCode);
    }
  
    document.getElementById("decodedText").textContent = decodedText;
  }