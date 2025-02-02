$(function(){
        var main = function(){
            autoSaveAndLoad("raw_json");
            $("#result").hide();
        }
        
        $("#dump_btn").click(function(){
            var json = $("#raw_json").val();
            if (! json) {
                alert("Before visualize, please fill json into blank above.\n解析したいJSONを入れてください。");
                return ;
            }
            var result = dump(json);
            if(result){
                $("#result").hide();
                $("#result").html(result);
                $("#result").show("fast");
                setListner();
            }
        });
        
        $("#reset_btn").click(function(){
            $("#raw_json").val('');
            $("#result").html('');
        });
        
        $("#sample_btn").click(function(){
            var sampleJSON ='\
{"team":"Team A","number":3,"users":[ \n\
    {"id":10001,"name":"Alice","age":18}, \n\
    {"id":10002,"name":"Bob","age":14}, \n\
    {"id":10003,"name":"Carol","age":22,"extra":{"birthday":"04/01","locate":"Tokyo"} \n\
}]}';
            $("#raw_json").val(sampleJSON);
            var json = $("#raw_json").val();
            var result = dump(json);
            if(result){
                $("#result").hide();
                $("#result").html(result);
                $("#result").show("fast");
                setListner();
            }
        });
        
        var getExtraParams = function(){
            
        
        };
        var dump = function(json){
            json = trimPadding(json);
            var obj = parseJSON(json);
            var formatted_json = JSON.stringify(obj, null, 4);
            console.log(formatted_json);
            $("#raw_json").val(formatted_json);
            return makeHtml(obj);
        };
        
        var trimPadding = function(jsonp){
            var match = null;
            var json_obj = '';
            var json_array = '';
            
            match = jsonp.match(/\{[\s\S]*\}/);
            if(match){
                var json_obj = match.toString();
            }
            
            match = jsonp.match(/\[[\s\S]*\]/);
            if(match){
                var json_array = match.toString()
            }
            
            if (json_array.length > json_obj.length) {
                return json_array;
            }
            return json_obj;
        }
        
        var parseJSON = function(json){
            try{
                var obj = JSON.parse(json);
            } catch(e){
                alert("[ERROR] Wrong JSON Format\n\n" + e);
                console.debug(json);
            }
            return obj;
        }
        
        var makeHtml = function(obj){
            return "<span class='key'>ROOT</span>" + _make(obj, "");
        }
        
        var _make = function(obj, nest){
            if (obj == null) {
                return "<span class='val no_val'>(null)</span>"
                     + "<span class='place'>"
                     + nest 
                     + "</span>"
                     + "<br>";
                
            } else if (typeof obj == 'object') {
                var tmp ="<span class='array'>(array)<br></span><div class='indent'>"
                for(o in obj){ 
                    tmp += "<span class='key'>"
                         + o
                         + "</span>:" 
                         + _make(obj[o], nest + "['" + o + "']");
                }
                return tmp + "</div>";
                
            } else {
                return "<span class='val'>"
                     + _escape(obj)
                     + "</span>"
                     + '<input class="place" size=100 value="data'
                     + nest
                     + '" onclick="this.select();" />'
                     + "<br>";
            }
        }


        var setListner = function(){
            $(".key").click(function(){
                $(this).next(".array").next(".indent").toggle("fast");
            });
            $(".array").click(function(){
                $(this).next(".indent").toggle("fast");
            });
            $(".place").click(function(){
                //alert(this.innerText);
            });

        }
        var _escape = function(ch) {
            if(typeof ch !== 'string')return ch;
            ch = ch.replace(/&/g,"&amp;") ;
            ch = ch.replace(/"/g,"&quot;") ;
            ch = ch.replace(/'/g,"&#039;") ;
            ch = ch.replace(/</g,"&lt;") ;
            ch = ch.replace(/>/g,"&gt;") ;
            return ch ;
        }
        
        $("#browse_btn").click(function(){
            $("#fileNameText").text("");
            $("#inputFile").val("");
            $('#inputFile').click();
        });        
                
        $("#inputFile").change(function(inputEvent) {
            let timeout_id = setTimeout(selectFileEvent , 1000, inputEvent); // msec
            $("#fileNameText").text("file:" + $("#inputFile")[0].files[0].name);
            $("#result").hide();
            
        });
        
        var selectFileEvent = function(inputEvent)
        {
            var files =  inputEvent.target.files;
            var fileReader = new FileReader();
            fileReader.onload = function () {
                $("#raw_json").val(this.result);
                $('#dump_btn').click();
            }
            var file = files[0] ;
            fileReader.readAsText(file) ;            
        }

        main(); 
});
