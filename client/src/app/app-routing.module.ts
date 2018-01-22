import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ImageViewComponent } from "./image-view/image-view.component";
import { HomeComponent } from "./home/home.component";

const appRoutes: Routes = [
	{"path": "", "component": HomeComponent, "pathMatch": "full"},
	{"path": ":collection", "component": ImageViewComponent}
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes, {useHash: true})
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule{

}