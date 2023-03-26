// This file is used to upload images to the server

const file = document.querySelector("#file");
file.addEventListener("change", (e) => {
    console.log("file change event");
    document.querySelector("#imageContainer").replaceChildren();
    const files = e.target.files;
    // imageUrls: array of image urls
    var imageUrls = [];
    for(let i = 0; i < files.length; i++){
        imageUrls.push(URL.createObjectURL(files[i]));
    }
    
    for(let i = 0; i < files.length; i++){
        string = "<img id='image" + i + "' src='" + imageUrls[i] + "' alt='image" + i + "' />";
        document.querySelector("#imageContainer").insertAdjacentHTML('beforeend', string);
    }

    const formData = new FormData();
    // formData: form data to be sent to the server
    for(let i = 0; i < files.length; i++){
        formData.append('image', files[i]);
    }
    
    // fetch("/post/upload", {
    //     method: "POST",
    //     body: formData
    // })
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log("after fetch" + data);
    //     }
    //     );
});

// function uploadImage(file, callback){
//     console.log("uploadImage called");
//     var formData = new FormData();
//     formData.append('image', file.target.files[0]);
//     $.ajax({
//       url: 'post/upload',
//       data: formData,
//       processData: false,
//       contentType: false,
//       type: 'POST',
//       success: function(data){
//         callback(data);
//       }
//     });
//   }