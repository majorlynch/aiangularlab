 import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";


@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
    ],
    exports: [
        ReactiveFormsModule,
        CommonModule,
        FormsModule
    ]
})
export class AppCommonModule { }