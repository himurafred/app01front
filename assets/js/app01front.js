var aList;

$(function(){

	//var backend = "http://applist01.slouis.cloudbees.net";
	var backend = "http://localhost:9000";
	
	var getList = function(uuid) {
		
		$("h1").html("Loading...");
		$("#listName").attr("disabled", "disabled").val("Loading...");
		
		$.ajax({
			url: backend + "/list/" + uuid + ".json",
			dataType: "json",
			type: "GET",
			success: function(data) {
				aList = data[0];
				$("#listName").removeAttr("disabled");
				$("#createList").submit(addItem);
				fillMail(aList.uuid);
				fillList(aList);
			},
			error: function(data) {
				$("#message").fadeIn();
			}
		});
	}
	
	var fillMail = function(uuid) {
		$("#send").find("a").attr("href", "mailto:?subject=Someone share a list with you&body= throw your idea here : http://127.0.0.1:9000/list/" + uuid);
	}
	
	var fillList = function(list) {
		$("h1").html(list.text);
		var listNameInput = $("#listName");
		listNameInput.val("");
		listNameInput.attr("placeholder", "Throw your ideas");
		var ul = $("#items").hide();
		$.each(list.elements, function(){
			var li = $("<li>").html(this.text);
			ul.prepend(li);
		});
		ul.slideDown("slow");
	}
	
	var addList = function() {
		$("#createList").submit(function(e){
			e.preventDefault();
			var listNameInput = $("#listName");
			if(listNameInput.val() == "") {
				$("#message2").fadeIn();
				return;
			}
			$("#message").hide();
			$("#message2").hide();
			var _this = $(this);
			$.ajax({
				url: backend + "/list.json",
				dataType: "json",
				type: "POST",
				data: {
					text: listNameInput.val()
				},
				success: function(data) {
					aList = data;
					fillMail(aList.uuid);
					$("h1").html(listNameInput.val());
					listNameInput.val("");
					listNameInput.attr("placeholder", "Throw your ideas");
					_this.unbind().submit(addItem);
				},
				error: function(data) {
					$("#message").fadeIn();
				}
			});
		});
	}
		
	var addItem = function(e){
		e.preventDefault();
		var listNameInput = $("#listName");
		if(listNameInput.val() == "") {
			$("#message2").fadeIn();
			return;
		}
		$("#message").hide();
		$("#message2").hide();
		$.ajax({
			url: backend + "/element/"+aList.uuid+"/"+listNameInput.val(),
			dataType: "json",
			type: "POST",
			data: {
				text: $(this).find("#listName").val()
			},
			success: function(data) {
				var li = $("<li>").html(listNameInput.val()).hide();
				$("#items").prepend(li);
				li.slideDown("slow");
				listNameInput.val("");
			},
			error: function(data) {
				$("#message").fadeIn();
			}
		});
	}
	
	
	
	
	
	
	

	$("#message").hide();
	$("#message2").hide();

	$("a.close").click(function(e) {
		$(this).parent().hide();
		e.preventDefault;
	});
	
	$("#send").click(function(e) {
		if(aList && aList.uuid) {
			window.location = $(this).find("a").attr("href");
		} else {
			e.preventDefault();
		}
	});
	
	
	
	
	
	
	var param = window.location.href.split("?");
	if(param[1]) {
		var uuid = param[1].split("=");
		if(uuid[1]) {
			getList(uuid[1]);
		} else {
			addList();
		}
	} else {
		addList();
	}
	
});