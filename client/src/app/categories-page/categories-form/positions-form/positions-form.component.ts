import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {Materialnstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: Position[] = [];
  loading: boolean = false;
  modal: Materialnstance;
  form: FormGroup;
  positionId = null;

  constructor(
    private positionsService: PositionsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(  null, [Validators.required, Validators.min(1)])
    });

    this.loading = true;

    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
      this.cdr.detectChanges();
    })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal?.destroy();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit(): void {
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    this.form.disable();

    const completed = () => {
      this.form.enable();
      this.modal.close();
      this.form.reset();
      this.cdr.detectChanges();
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe((position: Position) => {
        const idx = this.positions.findIndex(p => p._id == position._id);
        this.positions[idx] = position;
        MaterialService.toast('Изменения сохранены!');
      }, error => {

      }, completed)
    } else {
      this.positionsService.create(newPosition).subscribe((position: Position) => {
        MaterialService.toast('Позиция создана!');
        this.positions.push(position);
      }, error => {
        MaterialService.toast(error.error.message);
      }, completed);
    }
  }

  onAddPosition(): void {
    this.positionId = null;

    this.form.reset({
      name: null,
      cost: 1
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onSelectPosition(position: Position): void {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });

    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeletePosition(event: Event, position: Position): void {
    event.stopPropagation();
    const decision = window.confirm(`Удалить позицию ${position.name}?`);

    if (decision) {
      this.positionsService.delete(position).subscribe(response => {
        const idx = this.positions.findIndex(p => p._id == position._id);
        this.positions.splice(idx, 1);
        this.cdr.detectChanges();
        MaterialService.toast('Позиция удалена!');
      }, error => {
        MaterialService.toast(error.error.message);
      })
    }
  }
}
