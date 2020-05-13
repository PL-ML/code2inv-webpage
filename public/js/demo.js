const main_url = "http://localhost:5000/"

var selected_file = null

function getSource() {
    file_name = this.id.slice(5)
    document.getElementById("file_name").innerHTML="<h3>Loading "+file_name+"...</h3>"
    document.getElementById("file_source").innerText="Loading..."
    // console.log(main_url + "source_file?filename=" + file_name)
    $.ajax({
        url: main_url + "source_file?filename=" + file_name,
        type: "GET"
    }).done(function(response) {
        // console.log(response)
        document.getElementById("file_name").innerHTML="<h3><span id='fname'>"+file_name+"</span> <button class=\"btn btn-primary\" id=\"run_btn\">Run</button></h3>"
        document.getElementById("file_source").innerText=response
        // document.getElementById("file_source").classList.remove("prettyPrinted")
        $("#file_source").removeClass("prettyprinted")
        PR.prettyPrint()
        selected_file = file_name
        document.getElementById("result-card-title").innerHTML = "<h3>Result</h3>"
        document.getElementById("result").innerHTML = "/* The result will be displayed here */"
        $("#result").removeClass("prettyprinted")
        PR.prettyPrint()
        document.getElementById('run_btn').onclick = solveFile
    }).fail(function(error) {
        console.log(error)
    })

    return false
}

function solveFile() {
    file_name = document.getElementById("fname").innerHTML
    document.getElementById("result-card-title").innerHTML = '<h3>Running...<div class="loader"></h3>'
    document.getElementById("result").innerHTML="Running for " + file_name + "..."

    $.ajax({
        url: main_url + "solve?filename=" + file_name,
        type: "GET"
    }).done(function(response) {
        // console.log(response.filename + " " + document.getElementById("fname").innerHTML)
        if(response.filename == document.getElementById("fname").innerHTML) {
            document.getElementById("result-card-title").innerHTML = "<h3>Result</h3>"
            if(response.success) {
                document.getElementById("result").innerHTML = response.invar
                $("#result").removeClass("prettyprinted")
                PR.prettyPrint()
            } else {
                document.getElementById("result").innerHTML = "OOPS! An error was encountered :(\nThis was most probably a timeout error"
            }
            // console.log(response)
        }
    }).fail(function(error) {
        if(response.filename == document.getElementById("fname").innerHTML) {
            document.getElementById("result-card-title").innerHTML = "<h3>Result</h3>"
            document.getElementById("result").innerHTML = "OOPS! An error was encountered :("
        }
    })
}

window.onload = function() {
    children = document.getElementById("file_list").children
    for(var idx = 0; idx < children.length; idx++) {
        if(children[idx].nodeName == "A") {
            // console.log(children[idx].id.slice(5))
            document.getElementById(children[idx].id).onclick = getSource
        }
    }
}