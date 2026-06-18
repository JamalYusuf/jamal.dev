/**
 * Precision Crosshair Cursor
 * Opt-in subtle reticle — persisted preference, nav toggle, ESC shortcut.
 */
(function (global) {
    'use strict';

    var STORAGE_KEY = 'crosshair-cursor-enabled';

    var DEFAULTS = {
        gap: 26,
        idleDelay: 2200,
        showEscHint: false,
        hintDuration: 2200
    };

    var INTERACTIVE_SELECTOR = [
        'a[href]',
        'button',
        'input',
        'select',
        'textarea',
        'summary',
        '[role="button"]',
        '[role="link"]',
        '[onclick]',
        'label[for]'
    ].join(', ');

    var SEGMENT_CLASS = {
        top: 'crosshair-cursor__segment--top',
        bottom: 'crosshair-cursor__segment--bottom',
        left: 'crosshair-cursor__segment--left',
        right: 'crosshair-cursor__segment--right'
    };

    var instance = null;

    function mergeOptions(options) {
        options = options || {};
        return {
            gap: options.gap != null ? options.gap : DEFAULTS.gap,
            idleDelay: options.idleDelay != null ? options.idleDelay : DEFAULTS.idleDelay,
            showEscHint: options.showEscHint != null ? options.showEscHint : DEFAULTS.showEscHint,
            hintDuration: options.hintDuration != null ? options.hintDuration : DEFAULTS.hintDuration
        };
    }

    function readPreference() {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    function writePreference(enabled) {
        try {
            localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
        } catch (error) {
            /* storage unavailable */
        }
    }

    function PrecisionCrosshairCursor(options) {
        this.options = mergeOptions(options);
        this.root = null;
        this.hint = null;
        this.segments = {};
        this.ring = null;
        this.enabled = false;
        this.visible = true;
        this.state = 'active';
        this.isIdle = false;
        this.isTarget = false;
        this.x = global.innerWidth / 2;
        this.y = global.innerHeight / 2;
        this.halfGap = this.options.gap / 2;
        this.idleTimer = null;
        this.hintTimer = null;
        this.rafId = null;
        this.pendingX = this.x;
        this.pendingY = this.y;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onResize = this.onResize.bind(this);
        this.tick = this.tick.bind(this);
    }

    PrecisionCrosshairCursor.prototype.isSupported = function () {
        return global.matchMedia('(pointer: fine)').matches
            && !global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    PrecisionCrosshairCursor.prototype.buildDOM = function () {
        var root = document.createElement('div');
        root.className = 'crosshair-cursor is-hidden';
        root.setAttribute('aria-hidden', 'true');
        root.style.setProperty('--crosshair-gap', this.options.gap + 'px');
        root.classList.add('is-active');

        var names = ['top', 'bottom', 'left', 'right'];
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var segment = document.createElement('span');
            segment.className = 'crosshair-cursor__segment ' + SEGMENT_CLASS[name];
            root.appendChild(segment);
            this.segments[name] = segment;
        }

        var ring = document.createElement('span');
        ring.className = 'crosshair-cursor__ring';
        root.appendChild(ring);
        this.ring = ring;

        document.body.appendChild(root);
        this.root = root;

        if (this.options.showEscHint) {
            var hint = document.createElement('div');
            hint.className = 'crosshair-cursor-hint';
            hint.setAttribute('aria-hidden', 'true');
            document.body.appendChild(hint);
            this.hint = hint;
        }
    };

    PrecisionCrosshairCursor.prototype.syncToggleButton = function () {
        var button = document.getElementById('crosshair-toggle');
        if (!button) return;

        var active = this.enabled;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        button.setAttribute(
            'aria-label',
            active ? 'Disable precision cursor' : 'Enable precision cursor'
        );
        button.setAttribute(
            'title',
            active ? 'Precision cursor on' : 'Precision cursor off'
        );
    };

    PrecisionCrosshairCursor.prototype.isInteractiveAt = function (x, y) {
        var element = document.elementFromPoint(x, y);
        if (!element) return false;
        if (element.closest('.crosshair-cursor, .crosshair-cursor-hint')) return false;
        return Boolean(element.closest(INTERACTIVE_SELECTOR));
    };

    PrecisionCrosshairCursor.prototype.setState = function (state) {
        if (!this.root) return;

        this.state = state;
        this.isIdle = state === 'idle';
        this.isTarget = state === 'target';

        this.root.classList.toggle('is-active', state === 'active');
        this.root.classList.toggle('is-idle', this.isIdle);
        this.root.classList.toggle('is-target', this.isTarget);

        if (state === 'active') {
            this.root.style.setProperty('--crosshair-peak', '0.38');
            this.root.style.setProperty('--crosshair-fade-end', '18%');
        } else if (state === 'idle') {
            this.root.style.setProperty('--crosshair-peak', '0.12');
            this.root.style.setProperty('--crosshair-fade-end', '14%');
        } else if (state === 'target') {
            this.root.style.setProperty('--crosshair-peak', '0.95');
            this.root.style.setProperty('--crosshair-fade-end', '62%');
        }

        this.updateLayout(this.x, this.y);
    };

    PrecisionCrosshairCursor.prototype.updateLayout = function (x, y) {
        if (!this.root) return;

        var half = this.halfGap;
        var vh = global.innerHeight;
        var vw = global.innerWidth;
        var bottomTop = y + half;
        var rightLeft = x + half;

        this.segments.top.style.left = x + 'px';
        this.segments.top.style.top = '0px';
        this.segments.top.style.height = Math.max(0, y - half) + 'px';

        this.segments.bottom.style.left = x + 'px';
        this.segments.bottom.style.top = bottomTop + 'px';
        this.segments.bottom.style.height = Math.max(0, vh - bottomTop) + 'px';

        this.segments.left.style.top = y + 'px';
        this.segments.left.style.left = '0px';
        this.segments.left.style.width = Math.max(0, x - half) + 'px';

        this.segments.right.style.top = y + 'px';
        this.segments.right.style.left = rightLeft + 'px';
        this.segments.right.style.width = Math.max(0, vw - rightLeft) + 'px';

        this.ring.style.left = x + 'px';
        this.ring.style.top = y + 'px';
    };

    PrecisionCrosshairCursor.prototype.resetIdleTimer = function () {
        var self = this;
        if (this.idleTimer) clearTimeout(this.idleTimer);
        this.setState(this.isInteractiveAt(this.x, this.y) ? 'target' : 'active');
        this.idleTimer = setTimeout(function () {
            if (!self.isTarget) self.setState('idle');
        }, this.options.idleDelay);
    };

    PrecisionCrosshairCursor.prototype.tick = function () {
        this.rafId = null;
        this.x = this.pendingX;
        this.y = this.pendingY;
        this.updateLayout(this.x, this.y);

        var overInteractive = this.isInteractiveAt(this.x, this.y);
        if (overInteractive) {
            this.setState('target');
        } else if (!this.isIdle) {
            this.setState('active');
        }
    };

    PrecisionCrosshairCursor.prototype.onMouseMove = function (event) {
        if (!this.enabled || !this.visible) return;

        this.pendingX = event.clientX;
        this.pendingY = event.clientY;

        if (!this.rafId) {
            this.rafId = global.requestAnimationFrame(this.tick);
        }

        this.resetIdleTimer();
    };

    PrecisionCrosshairCursor.prototype.onMouseLeave = function () {
        if (!this.root) return;
        this.root.classList.add('is-hidden');
    };

    PrecisionCrosshairCursor.prototype.onMouseEnter = function () {
        if (!this.root || !this.visible || !this.enabled) return;
        this.root.classList.remove('is-hidden');
    };

    PrecisionCrosshairCursor.prototype.showHint = function (message) {
        var self = this;
        if (!this.hint) return;
        this.hint.textContent = message;
        this.hint.classList.add('is-visible');
        if (this.hintTimer) clearTimeout(this.hintTimer);
        this.hintTimer = setTimeout(function () {
            if (self.hint) self.hint.classList.remove('is-visible');
        }, this.options.hintDuration);
    };

    PrecisionCrosshairCursor.prototype.onKeyDown = function (event) {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        CrosshairCursor.toggle();
    };

    PrecisionCrosshairCursor.prototype.onResize = function () {
        if (!this.enabled) return;
        this.updateLayout(this.x, this.y);
    };

    PrecisionCrosshairCursor.prototype.prepare = function () {
        if (!this.isSupported()) return false;
        if (!this.root) {
            this.buildDOM();
            this.bindGlobal();
        }
        this.updateLayout(this.x, this.y);
        this.syncToggleButton();
        return true;
    };

    PrecisionCrosshairCursor.prototype.bind = function () {
        document.addEventListener('mousemove', this.onMouseMove, { passive: true });
        document.documentElement.addEventListener('mouseleave', this.onMouseLeave);
        document.documentElement.addEventListener('mouseenter', this.onMouseEnter);
        global.addEventListener('resize', this.onResize, { passive: true });
    };

    PrecisionCrosshairCursor.prototype.bindGlobal = function () {
        document.addEventListener('keydown', this.onKeyDown);
    };

    PrecisionCrosshairCursor.prototype.unbind = function () {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.documentElement.removeEventListener('mouseleave', this.onMouseLeave);
        document.documentElement.removeEventListener('mouseenter', this.onMouseEnter);
        global.removeEventListener('resize', this.onResize);

        if (this.idleTimer) clearTimeout(this.idleTimer);
        if (this.hintTimer) clearTimeout(this.hintTimer);
        if (this.rafId) global.cancelAnimationFrame(this.rafId);
    };

    PrecisionCrosshairCursor.prototype.unbindGlobal = function () {
        document.removeEventListener('keydown', this.onKeyDown);
    };

    PrecisionCrosshairCursor.prototype.enable = function () {
        if (!this.prepare()) return false;
        if (this.enabled) return true;

        document.documentElement.classList.add('crosshair-cursor-enabled');
        this.enabled = true;
        this.visible = true;
        this.root.classList.remove('is-hidden');
        this.setState('active');
        this.resetIdleTimer();
        this.bind();
        writePreference(true);
        this.syncToggleButton();
        return true;
    };

    PrecisionCrosshairCursor.prototype.disable = function () {
        if (!this.enabled) return;

        this.unbind();
        this.enabled = false;
        document.documentElement.classList.remove('crosshair-cursor-enabled');

        if (this.root) {
            this.root.classList.add('is-hidden');
        }

        writePreference(false);
        this.syncToggleButton();
    };

    PrecisionCrosshairCursor.prototype.toggle = function () {
        if (this.enabled) {
            this.disable();
            return false;
        }

        this.enable();
        return true;
    };

    PrecisionCrosshairCursor.prototype.destroy = function () {
        this.disable();
        this.unbindGlobal();

        if (this.root && this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }
        if (this.hint && this.hint.parentNode) {
            this.hint.parentNode.removeChild(this.hint);
        }

        this.root = null;
        this.hint = null;
        this.segments = {};
        this.ring = null;
    };

    var CrosshairCursor = {
        init: function (options) {
            if (instance) instance.destroy();
            instance = new PrecisionCrosshairCursor(options);
            instance.prepare();

            if (readPreference()) {
                instance.enable();
            } else {
                instance.syncToggleButton();
            }

            return instance;
        },

        getInstance: function () {
            return instance;
        },

        isEnabled: function () {
            return Boolean(instance && instance.enabled);
        },

        enable: function () {
            if (!instance) return CrosshairCursor.init().enable();
            return instance.enable();
        },

        disable: function () {
            if (instance) instance.disable();
        },

        toggle: function () {
            if (!instance) return CrosshairCursor.init().toggle();
            return instance.toggle();
        },

        destroy: function () {
            if (instance) {
                instance.destroy();
                instance = null;
            }
        }
    };

    global.CrosshairCursor = CrosshairCursor;
    global.toggleCrosshair = function () {
        return CrosshairCursor.toggle();
    };

    function bootCrosshair() {
        if (!document.getElementById('crosshair-toggle')) return;
        CrosshairCursor.init({ showEscHint: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootCrosshair);
    } else {
        bootCrosshair();
    }
})(window);