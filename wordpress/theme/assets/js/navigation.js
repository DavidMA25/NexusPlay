/**
 * NexusPlay Theme — Navigation
 * Gestiona el toggle del menú hamburger en móvil.
 */
( function () {
    'use strict';

    const toggle = document.querySelector( '.menu-toggle' );
    const nav    = document.querySelector( '.main-navigation' );

    if ( ! toggle || ! nav ) return;

    toggle.addEventListener( 'click', function () {
        const expanded = this.getAttribute( 'aria-expanded' ) === 'true';
        this.setAttribute( 'aria-expanded', String( ! expanded ) );
        nav.classList.toggle( 'toggled' );
    } );

    // Cerrar el menú si se hace clic fuera.
    document.addEventListener( 'click', function ( e ) {
        if ( nav.classList.contains( 'toggled' ) &&
             ! nav.contains( e.target ) &&
             ! toggle.contains( e.target ) ) {
            nav.classList.remove( 'toggled' );
            toggle.setAttribute( 'aria-expanded', 'false' );
        }
    } );
} )();
