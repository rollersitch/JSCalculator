// final draft
$(document).ready(function() {

  var ans = "";
  var info=">";
  var buffer = [];

  function op(op1, op2, optor) {
    switch(optor) {
      case '+':
        return (op1+op2);//.toFixed(3);
      case '-':
        return (op1-op2);//.toFixed(3);
      case '*':
        return (op1*op2);//.toFixed(3);
      case '/':
        return (op1/op2);//.toFixed(3);
      default:
        return undefined;
    }
  }

  function insert(list, arr, index) {
    //var i = index;
    var limit = list.length;

    for(var i = index; i<limit; i++) {
      arr.splice(i,0, list[i]);
    }
  }

  function compute(arr) {
    if(isOperator(last(arr)) || isDot(last(arr)) || isOperator(arr[0]) || isDot(arr[0])) {
      throw new Error("Espressione non valida");
    }
    console.log(arr.indexOf("/"));
    // Get rid of all multiply and divide
    while(arr.indexOf("*") !== -1 || arr.indexOf("/") !== -1) {
      for(var i = 0; i<arr.length; i++) {
        if(arr[i] === "*" || arr[i] === "/") {
          console.log("if entered");
          var j = i-1;
          while(!isOperator(arr[j]) && j>0) {
            j--;
          }
          var k = i+1;
          while(!isOperator(arr[k]) && k<arr.length) {
            k++;
          }

          var op1Slice = arr.slice(j,i);
          var op1 = parseFloat(op1Slice.join(''));

          var op2Slice = arr.slice(i+1, k);
          var op2 = parseFloat(op2Slice.join(''));
          var partial;
          if(arr[i] === "*")
            partial = op(op1, op2, "*");
          else
            partial = op(op1,op2,"/");

          var partialStr = "" + partial;
          var partialSplit = partialStr.split('');
          console.log(partialSplit);

          arr.splice(j, k-j+1);
          //k -= (k-j-1);
          insert(partialSplit, arr, j);
        }
      }
    }
    
    // Now let's make sum and difference
    // Some form of reduce 
    if(arr.indexOf("+") !== -1 || arr.indexOf("-") !== -1) {
      var strBuffer = buffer.join('');
      var res = eval(strBuffer);
      arr = [];
      arr.push("" + res);
    }

    return arr;

  }



  function isNum(s) {
    return (typeof parseFloat(s) === 'number' && !(isNaN(parseFloat(s))));
  }

  function isOperator(s) {
    switch(s) {
      case "+":
      case "-":
      case "*":
      case "/":
        return true;
    }
  }

  function isDot(s) {
    return s === ".";
  }


  function isDotWellPositioned(arr) {
    var i= arr.length - 1;
    while(i>0 && !isOperator(arr[i])) {
        if(isDot(arr[i])) {
            return false;
        }
        i--;
    }
    return true;    
  }


  function isZero(s) {
    return parseFloat(s) === 0;
  }

  function last(arr) {
    return arr[arr.length-1];
  }

  function updateView(conf){
    var args = [].slice.call(arguments);
    if(args.length === 0) {
      var newInfo = $("#info").text().concat(last(buffer));
      //newInfo.concat(last(buffer));
      console.log(newInfo);
      $("#info").text(newInfo);
    }
    else {
      $("#answer").text(conf.ans);
      $("#info").text(conf.info);
    }

  }

  $("button").on("click", pressListener);


  function pressListener(event) {
    event.preventDefault();

    var inserted = $(this).attr("value");

    if(isNum(inserted)) {
          if(isZero(inserted)) {
            if(buffer.length !== 0) {
              buffer.push(inserted);
              info.concat(inserted);
              updateView();
            }
          }
          else {
            buffer.push(parseFloat(inserted));
            info.concat(inserted);
            updateView();
          }
    }
    if(isOperator(inserted)) {
      if(!(isOperator(last(buffer))) &&
         !(isDot(last(buffer)) &&
          buffer.length !== 0)
         ) {
              buffer.push(inserted);
              info.concat(inserted);
              updateView();
            }
    }
    if(isDot(inserted)) {
      if(!(isDot(last(buffer))) &&
         !(isOperator(last(buffer))) &&
         (isDotWellPositioned(buffer))
        )
      {
        buffer.push(inserted);
        info.concat(inserted);
        updateView();
      }

    }

    if(inserted === "ac") {
      buffer = [];
      info = ">";
      updateView({ans: 0, info: '>'});
    }

    if(inserted === "=") {
      try {
        ans = compute(buffer);
        buffer = [];
        buffer.push(ans);
        console.log(ans);
        updateView({ans: ans.join(''), info: '>' + ans.join('')});
      } catch(err) {
        updateView({ans: 0, info: err});
      }
    }

  }

 
}); // end doc ready function