// This file is used to upload images to the server

const file = document.querySelector("#file");
file.addEventListener("change", (e) => {
    console.log("file change event");
    const files = e.target.files;
    const imageurl = URL.createObjectURL(files[0]);
    const imageurl2 = URL.createObjectURL(files[1]);
    const image = document.querySelector("#image");
    const image2 = document.querySelector("#image2");
    image.src = imageurl;
    image2.src = imageurl2;

    const formData = new FormData();
    // write me a for loop adding all file to formData
    for(let i = 0; i < files.length; i++){
        formData.append('image', files[i]);
    }
    
    fetch("/post/upload", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    }
    );
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