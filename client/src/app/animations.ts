import { trigger, transition, style, animate, state } from '@angular/animations';

export const appAnimations = [
    trigger(
        'appear', [
            transition(':enter', [
                style({ transform: 'scale(0)', opacity: 0 }),
                animate('200ms', style({ transform: 'scale(1)', opacity: 1 }))
            ])
        ]
    )
];
