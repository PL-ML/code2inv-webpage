const main_url = "http://localhost:5000/"

var selected_file = null
var file_contents = "/* Select a file to show its code */"
var graph_contents = "/* Select a file to show its graph */"
var vc_contents = "/* Select a file to show its verification conditions */"
var grammar = "/* Select a file to show its associated invariant grammar */"

var invariant = "/* The result will be displayed here */"
var stats = "/* The stats will be displayed here */"

function fill_src(element) {
    // console.log(element.children[0].id)
    var tabs = $("#src-tabs").children()
    for(var idx = 0; idx < tabs.length; idx++) {
        // console.log(tabs[idx].nodeName)
        tabs[idx].classList.remove("active")
    }

    element.classList.add("active")

    var selected_id = element.children[0].id

    if(selected_id == "src_source") {
        document.getElementById("file_source").innerText=file_contents
    } else if(selected_id == "src_graph") {
        document.getElementById("file_source").innerText=graph_contents
    } else if(selected_id == "src_vc") {
        document.getElementById("file_source").innerText=vc_contents
    } else if(selected_id == "src_grammar") {
        document.getElementById("file_source").innerText=grammar
    }

    $("#file_source").removeClass("prettyprinted")
    PR.prettyPrint()
}

function fill_res(element) {
    tabs = $("#res-tabs").children()
    for(var idx = 0; idx < tabs.length; idx++) {
        // console.log(tabs[idx].nodeName)
        tabs[idx].classList.remove("active")
    }

    element.classList.add("active")

    var selected_id = element.children[0].id

    if(selected_id == "res_inv") {
        document.getElementById("result").innerText=invariant
    } else if(selected_id == "res_stats") {
        document.getElementById("result").innerText=stats
    }
    $("#result").removeClass("prettyprinted")
    PR.prettyPrint()
}

function getSource() {
    file_name = this.id.slice(5)
    document.getElementById("file_name").innerHTML="<h3>Loading "+file_name+"...</h3>"
    document.getElementById("file_source").innerText="Loading..."
    file_contents = "/* Select a file to show its code */"
    graph_contents = "/* Select a file to show its graph */"
    vc_contents = "/* Select a file to show its verification conditions */"
    grammar = "/* Select a file to show its associated invariant grammar */"
    $("#src_source").parent().click()
    invariant = "Running for " + file_name + "..."
    stats = "Running for " + file_name + "..."
    $("#res_inv").parent().click()
    // console.log(main_url + "source_file?filename=" + file_name)
    $.ajax({
        url: main_url + "source_file?filename=" + file_name,
        type: "GET"
    }).done(function(response) {
        // console.log(response)
        // document.getElementById("tab-div").innerHTML='<ul class="nav nav-tabs"><li class="active"><a href="#">Code</a></li><li><a href="#">Graph</a></li></ul>'
        // console.log(response)
        if(response.success) {
            // document.getElementById("file_source").innerText=response.source
            document.getElementById("file_name").innerHTML="<h3><span id='fname'>"+file_name+"</span> <button class=\"btn btn-primary\" id=\"run_btn\">Run</button></h3>"
            file_contents = response.source
            graph_contents = response.graph
            vc_contents = response.vc
            grammar = response.grammar
            $("#src_source").parent().click()
        } else {
            document.getElementById("file_name").innerHTML="<h3><span id='fname'>Error</span></h3>"

            file_contents = "/* There was an error in retrieving the files */"
            graph_contents = "/* There was an error in retrieving the files */"
            vc_contents = "/* There was an error in retrieving the files */"
            grammar = "/* There was an error in retrieving the files */"
            $("#src_source").parent().click()
        }
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
    if(file_name.slice(-2) == ".c" || file_name.slice(-4) == ".smt") {
        document.getElementById("result-card-title").innerHTML = '<h3>Running...<div class="loader"></h3>'
        invariant = "Running for " + file_name + "..."
        stats = "Running for " + file_name + "..."
        $("#res_inv").parent().click()

        $.ajax({
            url: main_url + "solve?filename=" + file_name,
            type: "GET"
        }).done(function(response) {
            // console.log(response.filename + " " + document.getElementById("fname").innerHTML)
            if(response.filename == document.getElementById("fname").innerHTML) {
                document.getElementById("result-card-title").innerHTML = "<h3>Result</h3>"
                if(response.success) {
                    // document.getElementById("result").innerHTML = response.invar
                    // $("#result").removeClass("prettyprinted")
                    // PR.prettyPrint()
                    // invariant = response.invar
                    invariant = ""
                    space = "  "
                    spaces_to_insert = ""
                    for(var i = 0; i < response.invar.length; i++) {
                        var c = response.invar[i]
                        if(((c == "|" || c == "&") && response.invar[i-1] != c)) {
                            invariant += "\n" + spaces_to_insert + c
                        } else if(c == "(") {
                            var count = 0
                            while(count < space.length) {
                                spaces_to_insert += " "
                                count++
                            }
                            invariant += c
                        } else if(c == ")") {
                            var count = 0
                            while(spaces_to_insert.length > 0 && count < space.length) {
                                spaces_to_insert = spaces_to_insert.slice(0, -1)
                                count++
                            }
                            invariant += c
                        } else {
                            invariant += c
                        }
                    }

                    stats = ""
                    stats += "Time taken: " + response.time + "\n"
                    stats += "Number of Z3 calls: " + response.stats.actual_z3 + "\n"
                    stats += "Number of pre-condition tests: " + response.stats["ce-F:"] + "\n"
                    stats += "Number of inductive tests: " + response.stats["ce-I:"] + "\n"
                    stats += "Number of post-condition tests: " + response.stats["ce-T:"] + "\n"
                    $("#res_inv").parent().click()
                    // console.log(response)
                } else {
                    invariant = "OOPS! An error was encountered :(\nThis was most probably a timeout error"
                    stats = "OOPS! An error was encountered :(\nThis was most probably a timeout error"
                    $("#res_inv").parent().click()
                }
                // console.log(response)
            }
        }).fail(function(error) {
            if(response.filename == document.getElementById("fname").innerHTML) {
                document.getElementById("result-card-title").innerHTML = "<h3>Result</h3>"
                invariant = "OOPS! An error was encountered :("
                stats = "OOPS! An error was encountered :("
                $("#res_inv").parent().click()
            }
        })
    }
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