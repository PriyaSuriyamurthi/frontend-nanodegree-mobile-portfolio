<h1> Website Optimization Portfolio Project </h1>
<h2> Description of the changes:</h2>
<h3> HTML and CSS changes: </h3>
<h4> 1. Script link inside HTML </h4>
<p> Modified the script link inside the HTML to async which are not required during DOM construction. </p>
<ul>
<li> analystics.js </li>
<li> main.js </li>
<li> perfmatters.js </li>
</ul>
<p> pizza.html was modified to include view port meta link. This would be required when the page gets displayed on different device width and height
<h4> 2. CSS changes </h4>
<p> CSS changes are done in 2 parts:</p>
<ul>
<li> There were few css styles inlined to index.html as the styles are specific to this html. </li>
<li> There were few css styles defined without using class or id. This was updated with the class names so that it becomes less complex while cssom construction.</li>
<li> Not all the css properties were inlined as there were common styles for 4 html pages. 
     <ul>
      <li> index.html </li>
      <li> project-2048.html </li>
      <li> project-mobile.html </li>
      <li> project-webperf.html </li>
      </ul>
</li>
<li> pizza.html has all the styles inlined as these styles are specific to this page.</li>
<li> 2 css files were created and media query was used.  
     <ul>
     <li> print.css is only during the print operation. This was modified with media query so that rendering is not affected. </li>
    <li> style-portrait will be used only when the device is in portrait mode. This was also modified using media query so that  rendering doesn't get affected. </li>
    </ul>
</li>
  <li> pizza.html has few media query inlined in it. This is required to make sure the font-size of the contents are modified for the small devices. Also the display flex was modified to display:block using media query. This makes sure that the contents are not cut at the edge.
  </li></ul>
<h3> 3. JavaScript changes: </h3>
<h4> Pizza page changes: </h4>
<ul>
<li> Commented the functions selectRandomNonMeat, selectRandomCheese, selectRandomSauce and selectRandomCrust. Included one function itemGenerator which will randomly select the meat, nonmeat, cheese,sauce and crust based on the input passed to this function.
  <p> switch (item) { <br>
        case "meat":  <br>
            return (pizzaIngredients.meats[Math.floor((Math.random() * pizzaIngredients.meats.length))]); <br>
        case "nonmeats": <br>
            return (pizzaIngredients.nonMeats[Math.floor((Math.random() * pizzaIngredients.nonMeats.length))]); <br>
        case "cheese": <br>
            return (pizzaIngredients.cheeses[Math.floor((Math.random() * pizzaIngredients.cheeses.length))]); <br>
        case "sauce": <br>
            return (pizzaIngredients.sauces[Math.floor((Math.random() * pizzaIngredients.sauces.length))]); <br>
        case "crust": <br>
            return (pizzaIngredients.crusts[Math.floor((Math.random() * pizzaIngredients.crusts.length))]); <br>
        default: <br>
            console.log("bug in itemGenerator"); <br>
    } 
    </p>
</li>
<li> Modified the changePizzaSize function from not invoking determine function. The pizza width was calculated based on the slider size. This slider size keeps changing when the user moves the slide in the pizza section of the web page.
</li>
<li> Sliding pizza load was modified to create number of pizza based on the screen width and height. Also the included img-responsive for the moving pizza images. 
</li>
<li> UpdatePositions function was modified to calculate the phase value and the position well before the animate. optimizied the value calculation for phase and elemPosition fields.
</li>
<li> transform:translateX(pos) is used for positioning the moving pizza image. This would only require composite and doesn't invoke paint or recalculation. Also will-change has been used to provide a layer for each moving pizza
</li>
<li> Existing scroll listener was commented. Instead the updatePositions will called at regular intervals. <br>
This is determined as follows 
<br>
function update() { <br>
    var remainder = (document.body.scrollTop % 10) / 100; <br>
    if (remainder === 0) { <br>
        requestAnimationFrame(updatePositions); <br>
    } <br>
} <br> 
</li>
</ul>
<h2> 4. PageSpeed sights: </h2>
<a href="https://developers.google.com/speed/pagespeed/insights/">pagespeed Sights </a> <br>
<a href="http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/index.html">http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/index.html</a>
<a href="http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/project-2048.html">http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/project-2048.html</a>
<a href="http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/project-webperf.html">http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/project-webperf.html</a>
<a href="http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/project-mobile.html">http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/project-mobile.html</a>
<a href="http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/pizza.html">http://priyasuriyamurthi.github.io/OptimizedPortfolio/dist/pizza.html</a>

<h2> 5. Gulp for minify,compress </h2>
<p> Used Gulp to minify, compress and cache HTML,css and Javascript files.</p>
<p> Method to install and use Gulp </p>
<ul>
<li> Install node.js </li>
<li> Execute the commands on command line inside the project folder <br>
      npm install gulp --save-dev <br>
      npm install gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename --save-dev
</li>
<li> Create package.json file using npm init. Also create gulpfile.js which has the commands on the files to minify, compress and cache. Mention the destination folder to hold all the processed file.</li>
<li> Execute the command gulp serve to process the files and run the webpage.click Ctrl + c to exit</li>
<li> Execute command gulp to get the destination folder with processed files.</li>
<li> Add the destination folder to the github repository. The running web page is deployed to the github repository:
<a href="https://github.com/PriyaSuriyamurthi/priyasuriyamurthi.github.io/tree/master/OptimizedPortfolio/dist">https://github.com/PriyaSuriyamurthi/priyasuriyamurthi.github.io/tree/master/OptimizedPortfolio/dist</a>
</li>
</ul>






  
