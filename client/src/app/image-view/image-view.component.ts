import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {

	doc: Object;
	noMoreImages: boolean = false;
	userdefined_tag = [];
	collection: string;
	tagEntered: string = null;
	isAddTag: boolean = false;
	newTags: string[] = []; 
 
	constructor(private httpClient: HttpClient, 
		private router: Router,
		private route: ActivatedRoute){

	}

	ngOnInit(){
		this.route.params.subscribe((params: Params)=>{
			this.collection = params["collection"];
			console.log("with in, ", this.collection);
			this.httpClient.get("http://localhost:8080/"+ this.collection).subscribe((result: Object) => {
				console.log(result);
				if(!result["doc"]){
					this.noMoreImages = true;
					this.doc = null;
				}
				else{
					this.doc = result["doc"];
					this.noMoreImages = false;
				}
			});
		});
	}

	toggleTag(tag){
		if(this.doc){
			if(this.doc["userdefined_tags"].indexOf(tag)>=0){
				this.doc["userdefined_tags"].splice(this.doc["userdefined_tags"].indexOf(tag), 1);
				if(this.newTags.indexOf(tag)>=0)
					this.newTags.splice(this.newTags.indexOf(tag), 1);
			}
			else{
				console.log("tag added, ", tag);
				this.doc["userdefined_tags"].push(tag);
			}
		}
	}

	isUserdefinedTag(tag){
		if(this.doc){
			return this.doc["userdefined_tags"].indexOf(tag)>=0;
		}
	}

	saveDoc(){
			this.httpClient.post("http://localhost:8080/"+ this.collection, { doc: this.doc } ).subscribe((result: Object) => {
				console.log(result);
				if(!result["doc"]){
					this.noMoreImages = true;
					this.doc = null;
				}
				else{
					this.doc = result["doc"];
					this.noMoreImages = false;
				}
			});
	}

	addTag(){
		this.isAddTag = true;
	}

	addNewTag(){
		this.newTags.push(this.tagEntered);
		this.toggleTag(this.tagEntered);
		this.isAddTag = false;
		this.tagEntered = null;
	}

}