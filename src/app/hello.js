module.exports = {
  template: require('./hello.html'),
  controller: ['$log', '$scope', HelloController
  ]
};
function HelloController($log, $scope) {
  this.hello = 'Hello!';
  this.ff = 'ff';
  $scope.baser = 'dddd';
  var docDefinition;
  var imageUrl = [
    'https://www.w3schools.com/angular/pic_angular.jpg', 
    'https://opencollective-production.s3-us-west-1.amazonaws.com/ca272d00-958a-11e7-990a-e919fb36989b.png', 
    'https://angular.io/assets/images/logos/angular/angular.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1000px-React-icon.svg.png'
  ]
  $scope.bae64Images = [];
  // iterate through the image urls array and convert each image to base64
  for(var i = 0; i<imageUrl.length; i++) {
    getbase64Image(imageUrl[i]).then(
      base64Image => {
        //$log.log('Obtained data', base64Image)
        // add the converted base64 image to array
        $scope.bae64Images.push(base64Image);
      }
    )
    console.log(imageUrl[i]);
  }

  /**
   * @desc construct the pdf definition
   * @param {base64} base64Image 
   */
  function constructPDFData(base64Image) {
    console.log($scope.bae64Images);
    docDefinition = {
      content: [
        {
          text: 'Table depicting the list of open source frameworks',
          style: 'header',
          alignment: 'center'
        },
        {
          table: {
            body: [
              [
                {text: 'Name',style: 'tableHeader', alignment: 'center'},
                {text: 'Creation Date',style: 'tableHeader', alignment: 'center'},
                {text: 'Creator',style: 'tableHeader', alignment: 'center'},
                {text: 'Open Source',style: 'tableHeader', alignment: 'center'}
              ],
              ['AngularJS', '12-03-2011', 'Google', 'Yes'],
              ['Vue.js', '02-09-2016', 'Lin Chin', 'Yes'],
              ['Angular', '06-04-2016', 'Google', 'Yes'],
              [
                {text: 'React.js', style: 'tableHeader', alignment: 'center'},
                '09-07-2013', 'Facebook', 'Yes'
              ],
            ]
          },
          style: 'tableExample',
          alignment: 'center'
        },
        {
          text: 'Google image'
        },
        {
          image: $scope.bae64Images[0],
          fit: [100, 100]
        }
      ],
      styles: {
        header: {
          fontsize: 18,
          bold: true
        },
        tableExample: {
          margin: [100, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontsize: 16
        }
      }
    };
  }
  this.open = function () {
    constructPDFData('');
    $log.log('Opend', $scope.baser);
    pdfMake.createPdf(docDefinition).open();
  };

  /**
   * get the base64 format for the imagr
   * 
   */
  function getbase64Image(imageUrl) {
    return new Promise(function (resolve, reject) {
      convertToDataUrl(imageUrl, function (base64Image) {
        resolve(base64Image);
      })
    })
  };

  this.download = function () {
    $log.log('Downloading...');
    pdfMake.createPdf(docDefinition).download('sample.pdf');
    // show download modal/notification after 2 seconds
    // errr... Shoud be asynchronous brr... no way to handle it ????
    setTimeout(function() {
      $('#download-notification-modal').modal('show');
    },2000);
  };

  /**
   * 
   * @param {String} src 
   * @param {Function} callback 
   * @param {String} outputFormat 'image/png..' 
   */
  function convertToDataUrl(src, callback, outputFormat) {
    // Create an Image object
    var img = new Image();
    // Add CORS approval to prevent a tainted canvas
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      // Create an html canvas element
      var canvas = document.createElement('CANVAS');
      // Create a 2d context
      var ctx = canvas.getContext('2d');
      var dataURL;
      // Resize the canavas to the original image dimensions
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      // Draw the image to a canvas
      ctx.drawImage(this, 0, 0);
      // Convert the canvas to a data url
      dataURL = canvas.toDataURL(outputFormat);
      // Return the data url via callback
      callback(dataURL);
      // Mark the canvas to be ready for garbage 
      // collection 
      canvas = null;
    };
    // Load the image
    img.src = src;
    // make sure the load event fires for cached images too
    if (img.complete || img.complete === undefined) {
      // Flush cache
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      // Try again
      img.src = src;
    }
  } 
}
