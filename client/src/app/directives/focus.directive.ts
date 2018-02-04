import {Directive, Input, Output, ElementRef, Renderer, EventEmitter, OnChanges} from '@angular/core';

@Directive({
    selector: '[appFocus]'
})

export class FocusDirective implements OnChanges {
    @Input() appFocus: boolean;
    @Output() Focus: EventEmitter<void> = new EventEmitter<void>();

    constructor(private el: ElementRef, private renderer: Renderer) {
    }

    ngOnChanges() {
        if (!!this.appFocus) {
            this.renderer.invokeElementMethod(this.el.nativeElement, 'focus');
            if (!!this.Focus) {
                this.Focus.emit();
            }
        }
    }
}
