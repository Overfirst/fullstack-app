import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CategoriesService } from "../../shared/services/categories.service";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { MaterialService } from "../../shared/classes/material.service";
import {Category, Message} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesFormComponent implements OnInit {
  isNew = true;
  form: FormGroup;
  imagePreview: any = null;
  image: File;
  category: Category;

  @ViewChild('input') inputRef: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    if (!this.isNew) {
      this.form.disable();
    }

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id']);
          }
          return of(null);
        })
    )
      .subscribe((category: Category) => {
        if (category) {
          this.category = category;
          this.form.patchValue({ name: category.name });
          this.imagePreview = category.imageSrc;
          MaterialService.updateTextInputs();
        }
        this.form.enable();
        this.cdr.detectChanges();
      }, error => {
        MaterialService.toast(error.error.message);
      });
  }

  onSubmit(): void {
    this.form.disable();
    let obs$;

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe((category: Category) => {
      MaterialService.toast(this.isNew ? 'Категория создана' : 'Изменения сохранены');
      this.category = category;
      this.form.enable();
      this.cdr.detectChanges();
    }, error => {
      MaterialService.toast(error);
      this.form.enable();
      this.cdr.detectChanges();
    });
  }

  triggerClick(): void {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  deleteCategory(): void {
    const decision = window.confirm(`Вы уверены, что хотете удалить категорию ${this.category.name}?`);

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }
}
