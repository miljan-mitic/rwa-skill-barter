import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Offer } from '../../../../common/models/offer.model';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe, NgClass } from '@angular/common';
import { OverflowTooltip } from '../../../../shared/directives/overflow-tooltip';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { OFFER_STATUS_CLASSES } from '../../../../common/constants/offer-status.consts';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { OfferState } from '../../store/offer.state';
import { selectOfferGlobal } from '../../store/offer.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OfferRequestCreate } from '../../../offer-request/components/offer-request-create/offer-request-create';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-offer-item',
  imports: [
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    FlexLayoutModule,
    NgClass,
    RouterLink,
    DatePipe,
    OverflowTooltip,
  ],
  templateUrl: './offer-item.html',
  styleUrl: './offer-item.scss',
})
export class OfferItem implements OnInit {
  @Input({ required: true }) offer: Offer;
  global: boolean;
  dateFormat = DATE_FORMAT.DEFAULT;
  statusClasses = OFFER_STATUS_CLASSES;

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<OfferState>);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.store
      .select(selectOfferGlobal)
      .pipe(
        filter((global) => !!global),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((global) => {
        this.global = global;
      });
  }

  openRequestDialog(event: MouseEvent) {
    event.stopPropagation();

    this.dialog.open(OfferRequestCreate, {
      minWidth: '300px',
      minHeight: '300px',
      panelClass: 'offer-request-dialog',
      data: {
        offerId: this.offer.id,
        hasCurrentUserRequest: this.offer.hasCurrentUserRequest,
      },
    });
  }
}
