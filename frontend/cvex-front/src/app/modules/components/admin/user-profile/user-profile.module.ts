import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { MatCardModule } from '@angular/material/card'; // Importer MatCardModule
import { MatButtonModule } from '@angular/material/button'; // Pour les boutons si nécessaire
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
    declarations: [UserProfileComponent],
    imports: [
        CommonModule,
        MatCardModule, // Ajouter ici
        MatButtonModule, // Si vous utilisez les boutons Material
        MatIconModule,
        MatTreeModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule
    ],
})
export class UserProfileModule {}
