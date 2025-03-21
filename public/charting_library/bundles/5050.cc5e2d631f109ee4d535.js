(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5050],
  {
    45300: (e) => {
      e.exports = {};
    },
    66076: (e) => {
      e.exports = {
        'default-drawer-min-top-distance': '100px',
        wrap: 'wrap-_HnK0UIN',
        positionBottom: 'positionBottom-_HnK0UIN',
        backdrop: 'backdrop-_HnK0UIN',
        drawer: 'drawer-_HnK0UIN',
        positionLeft: 'positionLeft-_HnK0UIN',
      };
    },
    71986: (e) => {
      e.exports = {
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
        item: 'item-jFqVJoPk',
        hovered: 'hovered-jFqVJoPk',
        isDisabled: 'isDisabled-jFqVJoPk',
        isActive: 'isActive-jFqVJoPk',
        shortcut: 'shortcut-jFqVJoPk',
        toolbox: 'toolbox-jFqVJoPk',
        withIcon: 'withIcon-jFqVJoPk',
        'round-icon': 'round-icon-jFqVJoPk',
        icon: 'icon-jFqVJoPk',
        labelRow: 'labelRow-jFqVJoPk',
        label: 'label-jFqVJoPk',
        showOnHover: 'showOnHover-jFqVJoPk',
        'disclosure-item-circle-logo': 'disclosure-item-circle-logo-jFqVJoPk',
        showOnFocus: 'showOnFocus-jFqVJoPk',
      };
    },
    34587: (e) => {
      e.exports = { icon: 'icon-WB2y0EnP', dropped: 'dropped-WB2y0EnP' };
    },
    27267: (e, t, o) => {
      'use strict';
      function r(e, t, o, r, n) {
        function i(n) {
          if (e > n.timeStamp) return;
          const i = n.target;
          void 0 !== o && null !== t && null !== i && i.ownerDocument === r && (t.contains(i) || o(n));
        }
        return (
          n.click && r.addEventListener('click', i, !1),
          n.mouseDown && r.addEventListener('mousedown', i, !1),
          n.touchEnd && r.addEventListener('touchend', i, !1),
          n.touchStart && r.addEventListener('touchstart', i, !1),
          () => {
            r.removeEventListener('click', i, !1),
              r.removeEventListener('mousedown', i, !1),
              r.removeEventListener('touchend', i, !1),
              r.removeEventListener('touchstart', i, !1);
          }
        );
      }
      o.d(t, { addOutsideEventListener: () => r });
    },
    90186: (e, t, o) => {
      'use strict';
      function r(e) {
        return i(e, a);
      }
      function n(e) {
        return i(e, s);
      }
      function i(e, t) {
        const o = Object.entries(e).filter(t),
          r = {};
        for (const [e, t] of o) r[e] = t;
        return r;
      }
      function a(e) {
        const [t, o] = e;
        return 0 === t.indexOf('data-') && 'string' == typeof o;
      }
      function s(e) {
        return 0 === e[0].indexOf('aria-');
      }
      o.d(t, {
        filterAriaProps: () => n,
        filterDataProps: () => r,
        filterProps: () => i,
        isAriaAttribute: () => s,
        isDataAttribute: () => a,
      });
    },
    76460: (e, t, o) => {
      'use strict';
      function r(e) {
        return 0 === e.detail;
      }
      o.d(t, { isKeyboardClick: () => r });
    },
    76068: (e, t, o) => {
      'use strict';
      o.d(t, { CircleLogo: () => i });
      var r = o(50959),
        n = o(58492);
      o(45300);
      function i(e) {
        var t, o;
        const i = (0, n.getStyleClasses)(e.size, e.className),
          a = null !== (o = null !== (t = e.alt) && void 0 !== t ? t : e.title) && void 0 !== o ? o : '';
        return (0, n.isCircleLogoWithUrlProps)(e)
          ? r.createElement('img', {
              className: i,
              src: e.logoUrl,
              alt: a,
              title: e.title,
              loading: e.loading,
              'aria-label': e['aria-label'],
              'aria-hidden': e['aria-hidden'],
            })
          : r.createElement(
              'span',
              {
                className: i,
                title: e.title,
                'aria-label': e['aria-label'],
                'aria-hidden': e['aria-hidden'],
              },
              e.placeholderLetter,
            );
      }
    },
    58492: (e, t, o) => {
      'use strict';
      o.d(t, { getStyleClasses: () => n, isCircleLogoWithUrlProps: () => i });
      var r = o(97754);
      function n(e, t) {
        return r('tv-circle-logo', `tv-circle-logo--${e}`, t);
      }
      function i(e) {
        return 'logoUrl' in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length;
      }
    },
    37558: (e, t, o) => {
      'use strict';
      o.d(t, { DrawerContext: () => a, DrawerManager: () => i });
      var r = o(50959),
        n = o(99054);
      class i extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._isBodyFixed = !1),
            (this._addDrawer = (e) => {
              this.setState((t) => ({ stack: [...t.stack, e] }));
            }),
            (this._removeDrawer = (e) => {
              this.setState((t) => ({ stack: t.stack.filter((t) => t !== e) }));
            }),
            (this.state = { stack: [] });
        }
        componentDidUpdate(e, t) {
          !t.stack.length && this.state.stack.length && ((0, n.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, n.setFixedBodyState)(!1), (this._isBodyFixed = !1));
        }
        componentWillUnmount() {
          this.state.stack.length && this._isBodyFixed && (0, n.setFixedBodyState)(!1);
        }
        render() {
          return r.createElement(
            a.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.stack.length ? this.state.stack[this.state.stack.length - 1] : null,
              },
            },
            this.props.children,
          );
        }
      }
      const a = r.createContext(null);
    },
    41590: (e, t, o) => {
      'use strict';
      o.d(t, { Drawer: () => h });
      var r = o(50959),
        n = o(50151),
        i = o(97754),
        a = o(36174),
        s = o(65718),
        l = o(37558),
        c = o(29197),
        d = o(86656),
        u = o(66076);
      function h(e) {
        const { position: t = 'Bottom', onClose: o, children: d, className: h, theme: m = u } = e,
          f = (0, n.ensureNotNull)((0, r.useContext)(l.DrawerContext)),
          [v] = (0, r.useState)(() => (0, a.randomHash)()),
          g = (0, r.useRef)(null),
          b = (0, r.useContext)(c.CloseDelegateContext);
        return (
          (0, r.useLayoutEffect)(
            () => (
              (0, n.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              b.subscribe(f, o),
              f.addDrawer(v),
              () => {
                f.removeDrawer(v), b.unsubscribe(f, o);
              }
            ),
            [],
          ),
          r.createElement(
            s.Portal,
            null,
            r.createElement(
              'div',
              { className: i(u.wrap, u[`position${t}`]) },
              v === f.currentDrawer && r.createElement('div', { className: u.backdrop, onClick: o }),
              r.createElement(
                p,
                {
                  className: i(m.drawer, u[`position${t}`], h),
                  ref: g,
                  'data-name': e['data-name'],
                },
                d,
              ),
            ),
          )
        );
      }
      const p = (0, r.forwardRef)((e, t) => {
        const { className: o, ...n } = e;
        return r.createElement(d.TouchScrollContainer, {
          className: i(u.drawer, o),
          tabIndex: -1,
          ref: t,
          ...n,
        });
      });
    },
    16396: (e, t, o) => {
      'use strict';
      o.d(t, {
        DEFAULT_POPUP_MENU_ITEM_THEME: () => d,
        PopupMenuItem: () => h,
      });
      var r = o(50959),
        n = o(97754),
        i = o(59064),
        a = o(51768),
        s = o(90186),
        l = o(76068),
        c = o(71986);
      const d = c;
      function u(e) {
        e.stopPropagation();
      }
      function h(e) {
        const {
            id: t,
            role: o,
            'aria-label': d,
            'aria-selected': h,
            'aria-checked': p,
            className: m,
            title: f,
            labelRowClassName: v,
            labelClassName: g,
            shortcut: b,
            forceShowShortcuts: w,
            icon: E,
            isActive: D,
            isDisabled: k,
            isHovered: C,
            appearAsDisabled: x,
            label: N,
            link: O,
            showToolboxOnHover: _,
            showToolboxOnFocus: T,
            target: y,
            rel: M,
            toolbox: B,
            reference: F,
            onMouseOut: P,
            onMouseOver: L,
            onKeyDown: A,
            suppressToolboxClick: S = !0,
            theme: R = c,
            tabIndex: I,
            tagName: W,
            renderComponent: U,
            roundedIcon: j,
            iconAriaProps: z,
            circleLogo: Q,
          } = e,
          H = (0, s.filterDataProps)(e),
          K = (0, r.useRef)(null),
          G = (0, r.useMemo)(
            () =>
              (function (e) {
                function t(t) {
                  const { reference: o, ...n } = t,
                    i = null != e ? e : n.href ? 'a' : 'div',
                    a =
                      'a' === i
                        ? n
                        : (function (e) {
                            const {
                              download: t,
                              href: o,
                              hrefLang: r,
                              media: n,
                              ping: i,
                              rel: a,
                              target: s,
                              type: l,
                              referrerPolicy: c,
                              ...d
                            } = e;
                            return d;
                          })(n);
                  return r.createElement(i, { ...a, ref: o });
                }
                return (t.displayName = `DefaultComponent(${e})`), t;
              })(W),
            [W],
          ),
          V = null != U ? U : G;
        return r.createElement(
          V,
          {
            ...H,
            id: t,
            role: o,
            'aria-label': d,
            'aria-selected': h,
            'aria-checked': p,
            className: n(m, R.item, E && R.withIcon, {
              [R.isActive]: D,
              [R.isDisabled]: k || x,
              [R.hovered]: C,
            }),
            title: f,
            href: O,
            target: y,
            rel: M,
            reference: function (e) {
              (K.current = e), 'function' == typeof F && F(e);
              'object' == typeof F && (F.current = e);
            },
            onClick: function (t) {
              const { dontClosePopup: o, onClick: r, onClickArg: n, trackEventObject: s } = e;
              if (k) return;
              s && (0, a.trackEvent)(s.category, s.event, s.label);
              r && r(n, t);
              o || (0, i.globalCloseMenu)();
            },
            onContextMenu: function (t) {
              const { trackEventObject: o, trackRightClick: r } = e;
              o && r && (0, a.trackEvent)(o.category, o.event, `${o.label}_rightClick`);
            },
            onMouseUp: function (t) {
              const { trackEventObject: o, trackMouseWheelClick: r } = e;
              if (1 === t.button && O && o) {
                let e = o.label;
                r && (e += '_mouseWheelClick'), (0, a.trackEvent)(o.category, o.event, e);
              }
            },
            onMouseOver: L,
            onMouseOut: P,
            onKeyDown: A,
            tabIndex: I,
          },
          Q &&
            r.createElement(l.CircleLogo, {
              ...z,
              className: c['disclosure-item-circle-logo'],
              size: 'xxxsmall',
              logoUrl: Q.logoUrl,
              placeholderLetter: Q.placeholderLetter,
            }),
          E &&
            r.createElement('span', {
              'aria-label': z && z['aria-label'],
              'aria-hidden': z && Boolean(z['aria-hidden']),
              className: n(R.icon, j && c['round-icon']),
              dangerouslySetInnerHTML: { __html: E },
            }),
          r.createElement(
            'span',
            { className: n(R.labelRow, v) },
            r.createElement('span', { className: n(R.label, g) }, N),
          ),
          (void 0 !== b || w) &&
            r.createElement('span', { className: R.shortcut }, (q = b) && q.split('+').join(' + ')),
          void 0 !== B &&
            r.createElement(
              'span',
              {
                onClick: S ? u : void 0,
                className: n(R.toolbox, {
                  [R.showOnHover]: _,
                  [R.showOnFocus]: T,
                }),
              },
              B,
            ),
        );
        var q;
      }
    },
    20520: (e, t, o) => {
      'use strict';
      o.d(t, { PopupMenu: () => h });
      var r = o(50959),
        n = o(962),
        i = o(62942),
        a = o(65718),
        s = o(27317),
        l = o(29197);
      const c = r.createContext(void 0);
      var d = o(36383);
      const u = r.createContext({ setMenuMaxWidth: !1 });
      function h(e) {
        const {
            controller: t,
            children: o,
            isOpened: h,
            closeOnClickOutside: p = !0,
            doNotCloseOn: m,
            onClickOutside: f,
            onClose: v,
            onKeyboardClose: g,
            'data-name': b = 'popup-menu-container',
            ...w
          } = e,
          E = (0, r.useContext)(l.CloseDelegateContext),
          D = r.useContext(u),
          k = (0, r.useContext)(c),
          C = (0, d.useOutsideEvent)({
            handler: function (e) {
              f && f(e);
              if (!p) return;
              const t = (0, i.default)(m) ? m() : null == m ? [] : [m];
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = n.findDOMNode(o);
                  if (t instanceof Node && t.contains(e.target)) return;
                }
              v();
            },
            mouseDown: !0,
            touchStart: !0,
          });
        return h
          ? r.createElement(
              a.Portal,
              {
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                pointerEvents: 'none',
              },
              r.createElement(
                'span',
                { ref: C, style: { pointerEvents: 'auto' } },
                r.createElement(
                  s.Menu,
                  {
                    ...w,
                    onClose: v,
                    onKeyboardClose: g,
                    onScroll: function (t) {
                      const { onScroll: o } = e;
                      o && o(t);
                    },
                    customCloseDelegate: E,
                    customRemeasureDelegate: k,
                    ref: t,
                    'data-name': b,
                    limitMaxWidth: D.setMenuMaxWidth,
                  },
                  o,
                ),
              ),
            )
          : null;
      }
    },
    10381: (e, t, o) => {
      'use strict';
      o.d(t, { ToolWidgetCaret: () => l });
      var r = o(50959),
        n = o(97754),
        i = o(9745),
        a = o(34587),
        s = o(578);
      function l(e) {
        const { dropped: t, className: o } = e;
        return r.createElement(i.Icon, {
          className: n(o, a.icon, { [a.dropped]: t }),
          icon: s,
        });
      }
    },
    86656: (e, t, o) => {
      'use strict';
      o.d(t, { TouchScrollContainer: () => s });
      var r = o(50959),
        n = o(59142),
        i = o(50151),
        a = o(49483);
      const s = (0, r.forwardRef)((e, t) => {
        const { children: o, ...i } = e,
          s = (0, r.useRef)(null);
        return (
          (0, r.useImperativeHandle)(t, () => s.current),
          (0, r.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                null !== s.current && (0, n.disableBodyScroll)(s.current, { allowTouchMove: l(s) }),
                () => {
                  null !== s.current && (0, n.enableBodyScroll)(s.current);
                }
              );
          }, []),
          r.createElement('div', { ref: s, ...i }, o)
        );
      });
      function l(e) {
        return (t) => {
          const o = (0, i.ensureNotNull)(e.current),
            r = document.activeElement;
          return !o.contains(t) || (null !== r && o.contains(r) && r.contains(t));
        };
      }
    },
    78029: (e) => {
      e.exports = {
        button: 'button-GwQQdU8S',
        hover: 'hover-GwQQdU8S',
        isInteractive: 'isInteractive-GwQQdU8S',
        accessible: 'accessible-GwQQdU8S',
        isGrouped: 'isGrouped-GwQQdU8S',
        isActive: 'isActive-GwQQdU8S',
        isOpened: 'isOpened-GwQQdU8S',
        isDisabled: 'isDisabled-GwQQdU8S',
        text: 'text-GwQQdU8S',
        icon: 'icon-GwQQdU8S',
        endIcon: 'endIcon-GwQQdU8S',
      };
    },
    2869: (e) => {
      e.exports = { button: 'button-xNqEcuN2' };
    },
    42919: (e) => {
      e.exports = {
        button: 'button-merBkM5y',
        hover: 'hover-merBkM5y',
        accessible: 'accessible-merBkM5y',
        arrow: 'arrow-merBkM5y',
        arrowWrap: 'arrowWrap-merBkM5y',
        isOpened: 'isOpened-merBkM5y',
      };
    },
    12811: (e, t, o) => {
      'use strict';
      o.d(t, {
        HorizontalAttachEdge: () => n,
        HorizontalDropDirection: () => a,
        VerticalAttachEdge: () => r,
        VerticalDropDirection: () => i,
        getPopupPositioner: () => c,
      });
      var r,
        n,
        i,
        a,
        s = o(50151);
      !(function (e) {
        (e[(e.Top = 0)] = 'Top'), (e[(e.Bottom = 1)] = 'Bottom'), (e[(e.AutoStrict = 2)] = 'AutoStrict');
      })(r || (r = {})),
        (function (e) {
          (e[(e.Left = 0)] = 'Left'), (e[(e.Right = 1)] = 'Right');
        })(n || (n = {})),
        (function (e) {
          (e[(e.FromTopToBottom = 0)] = 'FromTopToBottom'), (e[(e.FromBottomToTop = 1)] = 'FromBottomToTop');
        })(i || (i = {})),
        (function (e) {
          (e[(e.FromLeftToRight = 0)] = 'FromLeftToRight'), (e[(e.FromRightToLeft = 1)] = 'FromRightToLeft');
        })(a || (a = {}));
      const l = {
        verticalAttachEdge: r.Bottom,
        horizontalAttachEdge: n.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: a.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      };
      function c(e, t) {
        return (o, c, d, u) => {
          var h, p;
          const m = (0, s.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: f = l.horizontalAttachEdge,
              horizontalDropDirection: v = l.horizontalDropDirection,
              horizontalMargin: g = l.horizontalMargin,
              verticalMargin: b = l.verticalMargin,
              matchButtonAndListboxWidths: w = l.matchButtonAndListboxWidths,
            } = t;
          let E = null !== (h = t.verticalAttachEdge) && void 0 !== h ? h : l.verticalAttachEdge,
            D = null !== (p = t.verticalDropDirection) && void 0 !== p ? p : l.verticalDropDirection;
          E === r.AutoStrict &&
            (u < m.y + m.height + b + c
              ? ((E = r.Top), (D = i.FromBottomToTop))
              : ((E = r.Bottom), (D = i.FromTopToBottom)));
          const k = E === r.Top ? -1 * b : b,
            C = f === n.Right ? m.right : m.left,
            x = E === r.Top ? m.top : m.bottom,
            N = {
              x: C - (v === a.FromRightToLeft ? o : 0) + g,
              y: x - (D === i.FromBottomToTop ? c : 0) + k,
            };
          return w && (N.overrideWidth = m.width), N;
        };
      }
    },
    31409: (e, t, o) => {
      'use strict';
      o.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => s,
        ToolWidgetButton: () => l,
      });
      var r = o(50959),
        n = o(97754),
        i = o(9745),
        a = o(78029);
      const s = a,
        l = r.forwardRef((e, t) => {
          const {
              tag: o = 'div',
              icon: s,
              endIcon: l,
              isActive: c,
              isOpened: d,
              isDisabled: u,
              isGrouped: h,
              isHovered: p,
              onClick: m,
              text: f,
              textBeforeIcon: v,
              title: g,
              theme: b = a,
              className: w,
              forceInteractive: E,
              inactive: D,
              'data-name': k,
              'data-tooltip': C,
              ...x
            } = e,
            N = n(w, b.button, (g || C) && 'apply-common-tooltip', {
              [b.isActive]: c,
              [b.isOpened]: d,
              [b.isInteractive]: (E || Boolean(m)) && !u && !D,
              [b.isDisabled]: Boolean(u || D),
              [b.isGrouped]: h,
              [b.hover]: p,
            }),
            O =
              s &&
              ('string' == typeof s
                ? r.createElement(i.Icon, { className: b.icon, icon: s })
                : r.cloneElement(s, {
                    className: n(b.icon, s.props.className),
                  }));
          return 'button' === o
            ? r.createElement(
                'button',
                {
                  ...x,
                  ref: t,
                  type: 'button',
                  className: n(N, b.accessible),
                  disabled: u && !D,
                  onClick: m,
                  title: g,
                  'data-name': k,
                  'data-tooltip': C,
                },
                v && f && r.createElement('div', { className: n('js-button-text', b.text) }, f),
                O,
                !v && f && r.createElement('div', { className: n('js-button-text', b.text) }, f),
              )
            : r.createElement(
                'div',
                {
                  ...x,
                  ref: t,
                  'data-role': 'button',
                  className: N,
                  onClick: u ? void 0 : m,
                  title: g,
                  'data-name': k,
                  'data-tooltip': C,
                },
                v && f && r.createElement('div', { className: n('js-button-text', b.text) }, f),
                O,
                !v && f && r.createElement('div', { className: n('js-button-text', b.text) }, f),
                l && r.createElement(i.Icon, { icon: l, className: a.endIcon }),
              );
        });
    },
    50813: (e, t, o) => {
      'use strict';
      o.d(t, { ToolWidgetIconButton: () => s });
      var r = o(50959),
        n = o(97754),
        i = o(31409),
        a = o(2869);
      const s = r.forwardRef(function (e, t) {
        const { className: o, id: s, ...l } = e;
        return r.createElement(i.ToolWidgetButton, {
          'data-name': s,
          ...l,
          ref: t,
          className: n(o, a.button),
        });
      });
    },
    8087: (e, t, o) => {
      'use strict';
      o.d(t, { ToolWidgetMenu: () => f });
      var r = o(50959),
        n = o(97754),
        i = o(3343),
        a = o(20520),
        s = o(10381),
        l = o(90186),
        c = o(37558),
        d = o(41590),
        u = o(12811),
        h = o(90692),
        p = o(76460),
        m = o(42919);
      class f extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._wrapperRef = null),
            (this._controller = r.createRef()),
            (this._handleWrapperRef = (e) => {
              (this._wrapperRef = e), this.props.reference && this.props.reference(e);
            }),
            (this._handleOpen = () => {
              var e;
              'div' !== this.props.tag && (null === (e = this._controller.current) || void 0 === e || e.focus());
            }),
            (this._handleClick = (e) => {
              e.target instanceof Node &&
                e.currentTarget.contains(e.target) &&
                (this._handleToggleDropdown(void 0, (0, p.isKeyboardClick)(e)),
                this.props.onClick && this.props.onClick(e, !this.state.isOpened));
            }),
            (this._handleToggleDropdown = (e, t = !1) => {
              const { onClose: o, onOpen: r } = this.props,
                { isOpened: n } = this.state,
                i = 'boolean' == typeof e ? e : !n;
              this.setState({ isOpened: i, shouldReturnFocus: !!i && t }), i && r && r(), !i && o && o();
            }),
            (this._handleClose = () => {
              this.close();
            }),
            (this._handleKeyDown = (e) => {
              var t;
              const { orientation: o = 'horizontal' } = this.props;
              if (e.defaultPrevented) return;
              if (!(e.target instanceof Node)) return;
              const r = (0, i.hashFromEvent)(e);
              if (e.currentTarget.contains(e.target))
                switch (r) {
                  case 40:
                    if ('div' === this.props.tag || 'horizontal' !== o) return;
                    if (this.state.isOpened) return;
                    e.preventDefault(), this._handleToggleDropdown(!0, !0);
                    break;
                  case 27:
                    if (!this.state.isOpened || !this.props.closeOnEsc) return;
                    e.preventDefault(), e.stopPropagation(), this._handleToggleDropdown(!1);
                }
              else {
                if ('div' === this.props.tag) return;
                switch (r) {
                  case 27: {
                    e.preventDefault();
                    const { shouldReturnFocus: o } = this.state;
                    this._handleToggleDropdown(!1), o && (null === (t = this._wrapperRef) || void 0 === t || t.focus());
                    break;
                  }
                }
              }
            }),
            (this.state = { isOpened: !1, shouldReturnFocus: !1 });
        }
        render() {
          const {
              tag: e = 'div',
              id: t,
              arrow: o,
              content: i,
              isDisabled: a,
              isDrawer: c,
              isShowTooltip: d,
              title: u,
              className: p,
              hotKey: m,
              theme: f,
              drawerBreakpoint: v,
              tabIndex: g,
            } = this.props,
            { isOpened: b } = this.state,
            w = n(p, f.button, {
              'apply-common-tooltip': d || !a,
              [f.isDisabled]: a,
              [f.isOpened]: b,
            });
          return 'button' === e
            ? r.createElement(
                'button',
                {
                  type: 'button',
                  id: t,
                  className: n(w, f.accessible),
                  disabled: a,
                  onClick: this._handleClick,
                  title: u,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  onKeyDown: this._handleKeyDown,
                  tabIndex: g,
                  ...(0, l.filterDataProps)(this.props),
                  ...(0, l.filterAriaProps)(this.props),
                },
                i,
                o &&
                  r.createElement(
                    'div',
                    { className: f.arrow },
                    r.createElement(
                      'div',
                      { className: f.arrowWrap },
                      r.createElement(s.ToolWidgetCaret, { dropped: b }),
                    ),
                  ),
                this.state.isOpened &&
                  (v
                    ? r.createElement(h.MatchMedia, { rule: v }, (e) => this._renderContent(e))
                    : this._renderContent(c)),
              )
            : r.createElement(
                'div',
                {
                  id: t,
                  className: w,
                  onClick: a ? void 0 : this._handleClick,
                  title: u,
                  'data-tooltip-hotkey': m,
                  ref: this._handleWrapperRef,
                  'data-role': 'button',
                  tabIndex: g,
                  onKeyDown: this._handleKeyDown,
                  ...(0, l.filterDataProps)(this.props),
                },
                i,
                o &&
                  r.createElement(
                    'div',
                    { className: f.arrow },
                    r.createElement(
                      'div',
                      { className: f.arrowWrap },
                      r.createElement(s.ToolWidgetCaret, { dropped: b }),
                    ),
                  ),
                this.state.isOpened &&
                  (v
                    ? r.createElement(h.MatchMedia, { rule: v }, (e) => this._renderContent(e))
                    : this._renderContent(c)),
              );
        }
        close() {
          this._handleToggleDropdown(!1);
        }
        focus() {
          var e;
          null === (e = this._wrapperRef) || void 0 === e || e.focus();
        }
        update() {
          null !== this._controller.current && this._controller.current.update();
        }
        _renderContent(e) {
          const {
              menuDataName: t,
              minWidth: o,
              menuClassName: n,
              maxHeight: i,
              drawerPosition: s = 'Bottom',
              children: l,
            } = this.props,
            { isOpened: h } = this.state,
            p = {
              horizontalMargin: this.props.horizontalMargin || 0,
              verticalMargin: this.props.verticalMargin || 2,
              verticalAttachEdge: this.props.verticalAttachEdge,
              horizontalAttachEdge: this.props.horizontalAttachEdge,
              verticalDropDirection: this.props.verticalDropDirection,
              horizontalDropDirection: this.props.horizontalDropDirection,
              matchButtonAndListboxWidths: this.props.matchButtonAndListboxWidths,
            },
            m = Boolean(h && e && s),
            f = (function (e) {
              return 'function' == typeof e;
            })(l)
              ? l({ isDrawer: m })
              : l;
          return m
            ? r.createElement(
                c.DrawerManager,
                null,
                r.createElement(d.Drawer, { onClose: this._handleClose, position: s, 'data-name': t }, f),
              )
            : r.createElement(
                a.PopupMenu,
                {
                  reference: this.props.menuReference,
                  controller: this._controller,
                  closeOnClickOutside: this.props.closeOnClickOutside,
                  doNotCloseOn: this,
                  isOpened: h,
                  minWidth: o,
                  onClose: this._handleClose,
                  position: (0, u.getPopupPositioner)(this._wrapperRef, p),
                  className: n,
                  maxHeight: i,
                  'data-name': t,
                  tabIndex: 'div' !== this.props.tag ? -1 : void 0,
                  onOpen: this._handleOpen,
                  onKeyDown: this.props.onMenuKeyDown,
                  onFocus: this.props.onMenuFocus,
                },
                f,
              );
        }
      }
      f.defaultProps = { arrow: !0, closeOnClickOutside: !0, theme: m };
    },
    578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>';
    },
  },
]);
