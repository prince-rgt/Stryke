(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5711],
  {
    88803: (e) => {
      e.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      };
    },
    55596: (e) => {
      e.exports = {
        dialog: 'dialog-b8SxMnzX',
        wrapper: 'wrapper-b8SxMnzX',
        separator: 'separator-b8SxMnzX',
        bounded: 'bounded-b8SxMnzX',
      };
    },
    12228: (e) => {
      e.exports = {
        itemRow: 'itemRow-BadjY5sX',
        favoriteButton: 'favoriteButton-BadjY5sX',
        active: 'active-BadjY5sX',
        selected: 'selected-BadjY5sX',
        mobile: 'mobile-BadjY5sX',
        itemInfo: 'itemInfo-BadjY5sX',
        title: 'title-BadjY5sX',
        details: 'details-BadjY5sX',
        itemInfoWithPadding: 'itemInfoWithPadding-BadjY5sX',
        favorite: 'favorite-BadjY5sX',
        removeButton: 'removeButton-BadjY5sX',
      };
    },
    69827: (e) => {
      e.exports = {
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        container: 'container-BZKENkhT',
        unsetAlign: 'unsetAlign-BZKENkhT',
        title: 'title-BZKENkhT',
        subtitle: 'subtitle-BZKENkhT',
        textWrap: 'textWrap-BZKENkhT',
        ellipsis: 'ellipsis-BZKENkhT',
        close: 'close-BZKENkhT',
        icon: 'icon-BZKENkhT',
      };
    },
    82434: (e) => {
      e.exports = { scrollWrap: 'scrollWrap-FaOvTD2r' };
    },
    77253: (e) => {
      e.exports = {
        wrap: 'wrap-vSb6C0Bj',
        'wrap--horizontal': 'wrap--horizontal-vSb6C0Bj',
        bar: 'bar-vSb6C0Bj',
        barInner: 'barInner-vSb6C0Bj',
        'barInner--horizontal': 'barInner--horizontal-vSb6C0Bj',
        'bar--horizontal': 'bar--horizontal-vSb6C0Bj',
      };
    },
    14877: (e) => {
      e.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      };
    },
    45719: (e) => {
      e.exports = { separator: 'separator-Pf4rIzEt' };
    },
    27306: (e) => {
      e.exports = {
        button: 'button-iLKiGOdQ',
        hovered: 'hovered-iLKiGOdQ',
        disabled: 'disabled-iLKiGOdQ',
        active: 'active-iLKiGOdQ',
        hidden: 'hidden-iLKiGOdQ',
      };
    },
    39416: (e, t, r) => {
      'use strict';
      r.d(t, { useFunctionalRefObject: () => i });
      var n = r(50959),
        o = r(43010);
      function i(e) {
        const t = (0, n.useMemo)(
            () =>
              (function (e) {
                const t = (r) => {
                  e(r), (t.current = r);
                };
                return (t.current = null), t;
              })((e) => {
                a.current(e);
              }),
            [],
          ),
          r = (0, n.useRef)(null),
          i = (t) => {
            if (null === t) return s(r.current, t), void (r.current = null);
            r.current !== e && ((r.current = e), s(r.current, t));
          },
          a = (0, n.useRef)(i);
        return (
          (a.current = i),
          (0, o.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current) return a.current(t.current), () => a.current(null);
          }, [e]),
          t
        );
      }
      function s(e, t) {
        null !== e && ('function' == typeof e ? e(t) : (e.current = t));
      }
    },
    43010: (e, t, r) => {
      'use strict';
      r.d(t, { useIsomorphicLayoutEffect: () => o });
      var n = r(50959);
      function o(e, t) {
        ('undefined' == typeof window ? n.useEffect : n.useLayoutEffect)(e, t);
      }
    },
    67842: (e, t, r) => {
      'use strict';
      r.d(t, { useResizeObserver: () => a });
      var n = r(50959),
        o = r(59255),
        i = r(43010),
        s = r(39416);
      function a(e, t = []) {
        const { callback: r, ref: a = null } = (function (e) {
            return 'function' == typeof e ? { callback: e } : e;
          })(e),
          l = (0, n.useRef)(null),
          c = (0, n.useRef)(r);
        c.current = r;
        const u = (0, s.useFunctionalRefObject)(a),
          d = (0, n.useCallback)(
            (e) => {
              u(e), null !== l.current && (l.current.disconnect(), null !== e && l.current.observe(e));
            },
            [u, l],
          );
        return (
          (0, i.useIsomorphicLayoutEffect)(
            () => (
              (l.current = new o.default((e, t) => {
                c.current(e, t);
              })),
              u.current && d(u.current),
              () => {
                var e;
                null === (e = l.current) || void 0 === e || e.disconnect();
              }
            ),
            [u, ...t],
          ),
          d
        );
      }
    },
    53017: (e, t, r) => {
      'use strict';
      function n(e) {
        return (t) => {
          e.forEach((e) => {
            'function' == typeof e ? e(t) : null != e && (e.current = t);
          });
        };
      }
      function o(e) {
        return n([e]);
      }
      r.d(t, { isomorphicRef: () => o, mergeRefs: () => n });
    },
    24437: (e, t, r) => {
      'use strict';
      r.d(t, { DialogBreakpoints: () => o });
      var n = r(88803);
      const o = {
        SmallHeight: n['small-height-breakpoint'],
        TabletSmall: n['tablet-small-breakpoint'],
        TabletNormal: n['tablet-normal-breakpoint'],
      };
    },
    35057: (e, t, r) => {
      'use strict';
      r.d(t, { AdaptivePopupDialog: () => B });
      var n = r(50959),
        o = r(50151);
      var i = r(97754),
        s = r.n(i),
        a = r(68335),
        l = r(38223),
        c = r(35749),
        u = r(63016),
        d = r(1109),
        h = r(24437),
        f = r(90692),
        p = r(95711);
      var v = r(52092),
        m = r(76422),
        g = r(9745);
      const b = n.createContext({ setHideClose: () => {} });
      var N = r(7720),
        C = r(69827);
      function w(e) {
        const {
            title: t,
            titleTextWrap: r = !1,
            subtitle: o,
            showCloseIcon: i = !0,
            onClose: a,
            onCloseButtonKeyDown: l,
            renderBefore: c,
            renderAfter: u,
            draggable: d,
            className: h,
            unsetAlign: f,
            closeAriaLabel: p,
            closeButtonReference: v,
          } = e,
          [m, w] = (0, n.useState)(!1);
        return n.createElement(
          b.Provider,
          { value: { setHideClose: w } },
          n.createElement(
            'div',
            { className: s()(C.container, h, (o || f) && C.unsetAlign) },
            c,
            n.createElement(
              'div',
              { 'data-dragg-area': d, className: C.title },
              n.createElement('div', { className: s()(r ? C.textWrap : C.ellipsis) }, t),
              o && n.createElement('div', { className: s()(C.ellipsis, C.subtitle) }, o),
            ),
            u,
            i &&
              !m &&
              n.createElement(
                'button',
                {
                  className: C.close,
                  onClick: a,
                  onKeyDown: l,
                  'data-name': 'close',
                  'aria-label': p,
                  type: 'button',
                  ref: v,
                },
                n.createElement(g.Icon, {
                  className: C.icon,
                  icon: N,
                  'data-name': 'close',
                  'data-role': 'button',
                }),
              ),
          ),
        );
      }
      var E = r(53017),
        _ = r(90186),
        P = r(55596);
      const k = { vertical: 20 },
        S = { vertical: 0 };
      class B extends n.PureComponent {
        constructor() {
          super(...arguments),
            (this._controller = null),
            (this._reference = null),
            (this._orientationMediaQuery = null),
            (this._renderChildren = (e, t) => (
              (this._controller = e),
              this.props.render({
                requestResize: this._requestResize,
                centerAndFit: this._centerAndFit,
                isSmallWidth: t,
              })
            )),
            (this._handleReference = (e) => (this._reference = e)),
            (this._handleCloseBtnClick = () => {
              this.props.onKeyboardClose && this.props.onKeyboardClose(), this._handleClose();
            }),
            (this._handleClose = () => {
              this.props.onClose();
            }),
            (this._handleOpen = () => {
              void 0 !== this.props.onOpen &&
                this.props.isOpened &&
                this.props.onOpen(this.props.fullScreen || window.matchMedia(h.DialogBreakpoints.TabletSmall).matches);
            }),
            (this._handleKeyDown = (e) => {
              if (!e.defaultPrevented) {
                if ((this.props.onKeyDown && this.props.onKeyDown(e), 27 === (0, a.hashFromEvent)(e))) {
                  if (e.defaultPrevented) return;
                  if (this.props.forceCloseOnEsc && this.props.forceCloseOnEsc())
                    return this.props.onKeyboardClose && this.props.onKeyboardClose(), void this._handleClose();
                  const { activeElement: r } = document,
                    n = (0, o.ensureNotNull)(this._reference);
                  if (null !== r) {
                    if (
                      (e.preventDefault(),
                      'true' === (t = r).getAttribute('data-haspopup') && 'true' !== t.getAttribute('data-expanded'))
                    )
                      return void this._handleClose();
                    if ((0, c.isTextEditingField)(r)) return void n.focus();
                    if (n.contains(r))
                      return this.props.onKeyboardClose && this.props.onKeyboardClose(), void this._handleClose();
                  }
                }
                var t, r;
                (function (e) {
                  if ('function' == typeof e) return e();
                  return Boolean(e);
                })(this.props.disableTabNavigationContainment) ||
                  ((r = e), [9, a.Modifiers.Shift + 9].includes((0, a.hashFromEvent)(r)) && r.stopPropagation());
              }
            }),
            (this._requestResize = () => {
              null !== this._controller && this._controller.recalculateBounds();
            }),
            (this._centerAndFit = () => {
              null !== this._controller && this._controller.centerAndFit();
            }),
            (this._calculatePositionWithOffsets = (e, t) => {
              const r = (0, o.ensureDefined)(this.props.fullScreenViewOffsets).value();
              return {
                top: r.top,
                left: (0, l.isRtl)() ? -r.right : r.left,
                width: t.clientWidth - r.left - r.right,
                height: t.clientHeight - r.top - r.bottom,
              };
            });
        }
        componentDidMount() {
          var e, t;
          this.props.ignoreClosePopupsAndDialog ||
            m.subscribe(v.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._handleClose, null),
            this._handleOpen(),
            void 0 !== this.props.onOpen &&
              ((this._orientationMediaQuery = window.matchMedia('(orientation: portrait)')),
              (e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.addEventListener) ? e.addEventListener('change', t) : e.addListener(t)),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.subscribe(this._requestResize);
        }
        componentWillUnmount() {
          var e, t;
          this.props.ignoreClosePopupsAndDialog ||
            m.unsubscribe(v.CLOSE_POPUPS_AND_DIALOGS_COMMAND, this._handleClose, null),
            null !== this._orientationMediaQuery &&
              ((e = this._orientationMediaQuery),
              (t = this._handleOpen),
              (null == e ? void 0 : e.removeEventListener) ? e.removeEventListener('change', t) : e.removeListener(t)),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.unsubscribe(this._requestResize);
        }
        focus() {
          (0, o.ensureNotNull)(this._reference).focus();
        }
        getElement() {
          return this._reference;
        }
        contains(e) {
          var t, r;
          return (
            null !== (r = null === (t = this._reference) || void 0 === t ? void 0 : t.contains(e)) && void 0 !== r && r
          );
        }
        render() {
          const {
              className: e,
              wrapperClassName: t,
              headerClassName: r,
              isOpened: o,
              title: i,
              titleTextWrap: a,
              dataName: l,
              onClickOutside: c,
              additionalElementPos: v,
              additionalHeaderElement: m,
              backdrop: g,
              shouldForceFocus: b = !0,
              shouldReturnFocus: N,
              showSeparator: C,
              subtitle: B,
              draggable: z = !0,
              fullScreen: L = !1,
              showCloseIcon: M = !0,
              rounded: D = !0,
              isAnimationEnabled: x,
              growPoint: R,
              dialogTooltip: O,
              unsetHeaderAlign: y,
              onDragStart: A,
              dataDialogName: T,
              closeAriaLabel: F,
              containerAriaLabel: I,
              reference: H,
              containerTabIndex: W,
              closeButtonReference: K,
              onCloseButtonKeyDown: j,
              shadowed: Y,
              fullScreenViewOffsets: X,
            } = this.props,
            Q = 'after' !== v ? m : void 0,
            V = 'after' === v ? m : void 0,
            Z = 'string' == typeof i ? i : T || '',
            G = (0, _.filterDataProps)(this.props),
            U = (0, E.mergeRefs)([this._handleReference, H]);
          return n.createElement(f.MatchMedia, { rule: h.DialogBreakpoints.SmallHeight }, (v) =>
            n.createElement(f.MatchMedia, { rule: h.DialogBreakpoints.TabletSmall }, (h) =>
              n.createElement(
                u.PopupDialog,
                {
                  rounded: !(h || L) && D,
                  className: s()(P.dialog, L && X && P.bounded, e),
                  isOpened: o,
                  reference: U,
                  onKeyDown: this._handleKeyDown,
                  onClickOutside: c,
                  onClickBackdrop: c,
                  fullscreen: h || L,
                  guard: v ? S : k,
                  boundByScreen: h || L,
                  shouldForceFocus: b,
                  shouldReturnFocus: N,
                  backdrop: g,
                  draggable: z,
                  isAnimationEnabled: x,
                  growPoint: R,
                  name: this.props.dataName,
                  dialogTooltip: O,
                  onDragStart: A,
                  containerAriaLabel: I,
                  containerTabIndex: W,
                  calculateDialogPosition: L && X ? this._calculatePositionWithOffsets : void 0,
                  shadowed: Y,
                  ...G,
                },
                n.createElement(
                  'div',
                  {
                    className: s()(P.wrapper, t),
                    'data-name': l,
                    'data-dialog-name': Z,
                  },
                  void 0 !== i &&
                    n.createElement(w, {
                      draggable: z && !(h || L),
                      onClose: this._handleCloseBtnClick,
                      renderAfter: V,
                      renderBefore: Q,
                      subtitle: B,
                      title: i,
                      titleTextWrap: a,
                      showCloseIcon: M,
                      className: r,
                      unsetAlign: y,
                      closeAriaLabel: F,
                      closeButtonReference: K,
                      onCloseButtonKeyDown: j,
                    }),
                  C &&
                    n.createElement(d.Separator, {
                      className: P.separator,
                    }),
                  n.createElement(p.PopupContext.Consumer, null, (e) => this._renderChildren(e, h || L)),
                ),
              ),
            ),
          );
        }
      }
    },
    64530: (e, t, r) => {
      'use strict';
      r.d(t, { DialogContentItem: () => d });
      var n = r(50959),
        o = r(97754),
        i = r.n(o),
        s = r(49483),
        a = r(36189),
        l = r(96040);
      function c(e) {
        const { url: t, ...r } = e;
        return t ? n.createElement('a', { ...r, href: t }) : n.createElement('div', { ...r });
      }
      var u = r(12228);
      function d(e) {
        const {
          title: t,
          subtitle: r,
          removeBtnLabel: o,
          onClick: d,
          onClickFavorite: f,
          onClickRemove: p,
          isActive: v,
          isSelected: m,
          isFavorite: g,
          isMobile: b = !1,
          showFavorite: N = !0,
          ...C
        } = e;
        return n.createElement(
          c,
          {
            ...C,
            className: i()(u.itemRow, v && !m && u.active, b && u.mobile, m && u.selected),
            onClick: h.bind(null, d),
            'data-role': 'list-item',
            'data-active': v,
          },
          N &&
            f &&
            n.createElement(a.FavoriteButton, {
              className: i()(u.favoriteButton, g && u.favorite, s.CheckMobile.any() && u.mobile),
              isActive: v && !m,
              isFilled: g,
              onClick: h.bind(null, f),
              'data-name': 'list-item-favorite-button',
              'data-favorite': g,
            }),
          n.createElement(
            'div',
            { className: i()(u.itemInfo, !N && u.itemInfoWithPadding) },
            n.createElement(
              'div',
              {
                className: i()(u.title, v && !m && u.active, b && u.mobile),
                'data-name': 'list-item-title',
              },
              t,
            ),
            n.createElement('div', { className: i()(u.details, v && !m && u.active, b && u.mobile) }, r),
          ),
          n.createElement(l.RemoveButton, {
            className: u.removeButton,
            isActive: v && !m,
            onClick: h.bind(null, p),
            'data-name': 'list-item-remove-button',
            title: o,
          }),
        );
      }
      function h(e, t) {
        t.defaultPrevented || (t.preventDefault(), e(t));
      }
    },
    3085: (e, t, r) => {
      'use strict';
      r.d(t, { OverlayScrollContainer: () => v });
      var n = r(50959),
        o = r(97754),
        i = r.n(o),
        s = r(38223),
        a = r(50151),
        l = r(37160);
      const c = r(77253),
        u = {
          0: {
            isHorizontal: !1,
            isNegative: !1,
            sizePropName: 'height',
            minSizePropName: 'minHeight',
            startPointPropName: 'top',
            currentMousePointPropName: 'clientY',
            progressBarTransform: 'translateY',
          },
          1: {
            isHorizontal: !0,
            isNegative: !1,
            sizePropName: 'width',
            minSizePropName: 'minWidth',
            startPointPropName: 'left',
            currentMousePointPropName: 'clientX',
            progressBarTransform: 'translateX',
          },
          2: {
            isHorizontal: !0,
            isNegative: !0,
            sizePropName: 'width',
            minSizePropName: 'minWidth',
            startPointPropName: 'right',
            currentMousePointPropName: 'clientX',
            progressBarTransform: 'translateX',
          },
        },
        d = 40;
      function h(e) {
        const {
            size: t,
            scrollSize: r,
            clientSize: o,
            scrollProgress: s,
            onScrollProgressChange: h,
            scrollMode: f,
            theme: p = c,
            onDragStart: v,
            onDragEnd: m,
            minBarSize: g = d,
          } = e,
          b = (0, n.useRef)(null),
          N = (0, n.useRef)(null),
          [C, w] = (0, n.useState)(!1),
          E = (0, n.useRef)(0),
          {
            isHorizontal: _,
            isNegative: P,
            sizePropName: k,
            minSizePropName: S,
            startPointPropName: B,
            currentMousePointPropName: z,
            progressBarTransform: L,
          } = u[f];
        (0, n.useEffect)(() => {
          const e = (0, a.ensureNotNull)(b.current).ownerDocument;
          return (
            C ? (v && v(), e && (e.addEventListener('mousemove', F), e.addEventListener('mouseup', I))) : m && m(),
            () => {
              e && (e.removeEventListener('mousemove', F), e.removeEventListener('mouseup', I));
            }
          );
        }, [C]);
        const M = t / r || 0,
          D = o * M || 0,
          x = Math.max(D, g),
          R = (t - x) / (t - D),
          O = r - t,
          y = P ? -O : 0,
          A = P ? 0 : O,
          T = W((0, l.clamp)(s, y, A)) || 0;
        return n.createElement(
          'div',
          {
            ref: b,
            className: i()(p.wrap, _ && p['wrap--horizontal']),
            style: { [k]: t },
            onMouseDown: function (e) {
              if (e.isDefaultPrevented()) return;
              e.preventDefault();
              const t = H(e.nativeEvent, (0, a.ensureNotNull)(b.current)),
                r = Math.sign(t),
                n = (0, a.ensureNotNull)(N.current).getBoundingClientRect();
              E.current = (r * n[k]) / 2;
              let o = Math.abs(t) - Math.abs(E.current);
              const i = W(O);
              o < 0 ? ((o = 0), (E.current = t)) : o > i && ((o = i), (E.current = t - r * i));
              h(K(r * o)), w(!0);
            },
          },
          n.createElement(
            'div',
            {
              ref: N,
              className: i()(p.bar, _ && p['bar--horizontal']),
              style: { [S]: g, [k]: x, transform: `${L}(${T}px)` },
              onMouseDown: function (e) {
                e.preventDefault(), (E.current = H(e.nativeEvent, (0, a.ensureNotNull)(N.current))), w(!0);
              },
            },
            n.createElement('div', {
              className: i()(p.barInner, _ && p['barInner--horizontal']),
            }),
          ),
        );
        function F(e) {
          const t = H(e, (0, a.ensureNotNull)(b.current)) - E.current;
          h(K(t));
        }
        function I() {
          w(!1);
        }
        function H(e, t) {
          const r = t.getBoundingClientRect()[B];
          return e[z] - r;
        }
        function W(e) {
          return e * M * R;
        }
        function K(e) {
          return e / M / R;
        }
      }
      var f = r(70412),
        p = r(82434);
      function v(e) {
        const {
            reference: t,
            className: r,
            containerHeight: i = 0,
            containerWidth: a = 0,
            contentHeight: l = 0,
            contentWidth: c = 0,
            scrollPosTop: u = 0,
            scrollPosLeft: d = 0,
            onVerticalChange: v,
            onHorizontalChange: m,
            visible: g,
          } = e,
          [b, N] = (0, f.useHover)(),
          [C, w] = (0, n.useState)(!1),
          E = i < l,
          _ = a < c,
          P = E && _ ? 8 : 0;
        return n.createElement(
          'div',
          {
            ...N,
            ref: t,
            className: o(r, p.scrollWrap),
            style: { visibility: g || b || C ? 'visible' : 'hidden' },
          },
          E &&
            n.createElement(h, {
              size: i - P,
              scrollSize: l - P,
              clientSize: i - P,
              scrollProgress: u,
              onScrollProgressChange: function (e) {
                v && v(e);
              },
              onDragStart: k,
              onDragEnd: S,
              scrollMode: 0,
            }),
          _ &&
            n.createElement(h, {
              size: a - P,
              scrollSize: c - P,
              clientSize: a - P,
              scrollProgress: d,
              onScrollProgressChange: function (e) {
                m && m(e);
              },
              onDragStart: k,
              onDragEnd: S,
              scrollMode: (0, s.isRtl)() ? 2 : 1,
            }),
        );
        function k() {
          w(!0);
        }
        function S() {
          w(!1);
        }
      }
    },
    36189: (e, t, r) => {
      'use strict';
      r.d(t, { FavoriteButton: () => d });
      var n = r(44352),
        o = r(50959),
        i = r(97754),
        s = r(9745),
        a = r(39146),
        l = r(48010),
        c = r(14877);
      const u = {
        add: n.t(null, void 0, r(44629)),
        remove: n.t(null, void 0, r(72482)),
      };
      function d(e) {
        const { className: t, isFilled: r, isActive: n, onClick: d, ...h } = e;
        return o.createElement(s.Icon, {
          ...h,
          className: i(c.favorite, 'apply-common-tooltip', r && c.checked, n && c.active, t),
          icon: r ? a : l,
          onClick: d,
          title: r ? u.remove : u.add,
        });
      }
    },
    898: (e, t, r) => {
      'use strict';
      r.d(t, { useDimensions: () => i });
      var n = r(50959),
        o = r(67842);
      function i() {
        const [e, t] = (0, n.useState)(null),
          r = (0, n.useCallback)(
            ([r]) => {
              const n = r.target.getBoundingClientRect();
              (n.width === (null == e ? void 0 : e.width) && n.height === e.height) || t(n);
            },
            [e],
          );
        return [(0, o.useResizeObserver)(r), e];
      }
    },
    70412: (e, t, r) => {
      'use strict';
      r.d(t, {
        hoverMouseEventFilter: () => i,
        useAccurateHover: () => s,
        useHover: () => o,
      });
      var n = r(50959);
      function o() {
        const [e, t] = (0, n.useState)(!1);
        return [
          e,
          {
            onMouseOver: function (e) {
              i(e) && t(!0);
            },
            onMouseOut: function (e) {
              i(e) && t(!1);
            },
          },
        ];
      }
      function i(e) {
        return !e.currentTarget.contains(e.relatedTarget);
      }
      function s(e) {
        const [t, r] = (0, n.useState)(!1);
        return (
          (0, n.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return;
              const n = e.current.contains(t.target);
              r(n);
            };
            return document.addEventListener('mouseover', t), () => document.removeEventListener('mouseover', t);
          }, []),
          t
        );
      }
    },
    33127: (e, t, r) => {
      'use strict';
      r.d(t, { useOverlayScroll: () => l });
      var n = r(50959),
        o = r(50151),
        i = r(70412),
        s = r(49483);
      const a = { onMouseOver: () => {}, onMouseOut: () => {} };
      function l(e, t = s.CheckMobile.any()) {
        const r = (0, n.useRef)(null),
          l = e || (0, n.useRef)(null),
          [c, u] = (0, i.useHover)(),
          [d, h] = (0, n.useState)({
            reference: r,
            containerHeight: 0,
            containerWidth: 0,
            contentHeight: 0,
            contentWidth: 0,
            scrollPosTop: 0,
            scrollPosLeft: 0,
            onVerticalChange: function (e) {
              h((t) => ({ ...t, scrollPosTop: e })), ((0, o.ensureNotNull)(l.current).scrollTop = e);
            },
            onHorizontalChange: function (e) {
              h((t) => ({ ...t, scrollPosLeft: e })), ((0, o.ensureNotNull)(l.current).scrollLeft = e);
            },
            visible: c,
          }),
          f = (0, n.useCallback)(() => {
            if (!l.current) return;
            const {
                clientHeight: e,
                scrollHeight: t,
                scrollTop: n,
                clientWidth: o,
                scrollWidth: i,
                scrollLeft: s,
              } = l.current,
              a = r.current ? r.current.offsetTop : 0;
            h((r) => ({
              ...r,
              containerHeight: e - a,
              contentHeight: t - a,
              scrollPosTop: n,
              containerWidth: o,
              contentWidth: i,
              scrollPosLeft: s,
            }));
          }, []);
        function p() {
          h((e) => ({
            ...e,
            scrollPosTop: (0, o.ensureNotNull)(l.current).scrollTop,
            scrollPosLeft: (0, o.ensureNotNull)(l.current).scrollLeft,
          }));
        }
        return (
          (0, n.useEffect)(() => {
            c && f(), h((e) => ({ ...e, visible: c }));
          }, [c]),
          (0, n.useEffect)(() => {
            const e = l.current;
            return (
              e && e.addEventListener('scroll', p),
              () => {
                e && e.removeEventListener('scroll', p);
              }
            );
          }, [l]),
          [d, t ? a : u, l, f]
        );
      }
    },
    1109: (e, t, r) => {
      'use strict';
      r.d(t, { Separator: () => s });
      var n = r(50959),
        o = r(97754),
        i = r(45719);
      function s(e) {
        return n.createElement('div', {
          className: o(i.separator, e.className),
        });
      }
    },
    96040: (e, t, r) => {
      'use strict';
      r.d(t, { RemoveButton: () => c });
      var n = r(44352),
        o = r(50959),
        i = r(97754),
        s = r(9745),
        a = r(33765),
        l = r(27306);
      function c(e) {
        const {
          className: t,
          isActive: c,
          onClick: u,
          onMouseDown: d,
          title: h,
          hidden: f,
          'data-name': p = 'remove-button',
          ...v
        } = e;
        return o.createElement(s.Icon, {
          ...v,
          'data-name': p,
          className: i(l.button, 'apply-common-tooltip', c && l.active, f && l.hidden, t),
          icon: a,
          onClick: u,
          onMouseDown: d,
          title: h || n.t(null, void 0, r(34596)),
        });
      }
    },
    33765: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="currentColor" d="M9.707 9l4.647-4.646-.707-.708L9 8.293 4.354 3.646l-.708.708L8.293 9l-4.647 4.646.708.708L9 9.707l4.646 4.647.708-.707L9.707 9z"/></svg>';
    },
    7720: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17" fill="currentColor"><path d="m.58 1.42.82-.82 15 15-.82.82z"/><path d="m.58 15.58 15-15 .82.82-15 15z"/></svg>';
    },
    39146: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>';
    },
    48010: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>';
    },
    44629: (e) => {
      e.exports = {
        ar: ['اضف إلى القائمة التفضيلات'],
        ca_ES: ['Afegeix a preferits'],
        cs: ['Přidat do oblíbených'],
        de: ['Zu Favoriten hinzufügen'],
        el: ['Προσθήκη στα αγαπημένα'],
        en: 'Add to favorites',
        es: ['Añadir a favoritos'],
        fa: ['افزودن به موارد مورد علاقه'],
        fr: ['Ajouter aux favoris'],
        he_IL: ['הוסף למועדפים'],
        hu_HU: ['Hozzáadás kedvencekhez'],
        id_ID: ['Tambah ke daftar favorit'],
        it: ['Aggiungi ai preferiti'],
        ja: ['お気に入りに追加'],
        ko: ['즐겨찾기에 넣기'],
        ms_MY: ['Tambah kepada kegemaran'],
        nl_NL: ['Voeg toe aan favorieten'],
        pl: ['Dodaj do ulubionych'],
        pt: ['Adicionar aos favoritos'],
        ro: 'Add to favorites',
        ru: ['Добавить в избранное'],
        sv: ['Lägg till som favorit'],
        th: ['เพิ่มลงรายการโปรด'],
        tr: ['Favorilere ekle'],
        vi: ['Thêm vào mục yêu thích'],
        zh: ['添加到收藏'],
        zh_TW: ['加入收藏'],
      };
    },
    72482: (e) => {
      e.exports = {
        ar: ['حذف من القائمة المفضلة'],
        ca_ES: ['Treure de preferits'],
        cs: ['Odebrat z oblíbených'],
        de: ['Aus Favoriten entfernen'],
        el: ['Διαγραφή απο τα αγαπημένα'],
        en: 'Remove from favorites',
        es: ['Quitar de favoritos'],
        fa: ['حذف از موارد مورد علاقه'],
        fr: ['Retirer des favoris'],
        he_IL: ['הסר ממועדפים'],
        hu_HU: ['Eltávolít kedvencek közül'],
        id_ID: ['Hilangkan dari favorit'],
        it: ['Rimuovi dai preferiti'],
        ja: ['お気に入りから削除'],
        ko: ['즐겨찾기지움'],
        ms_MY: ['Buang dari kegemaran'],
        nl_NL: ['Verwijder van favorieten'],
        pl: ['Usuń z ulubionych'],
        pt: ['Remover dos favoritos'],
        ro: 'Remove from favorites',
        ru: ['Удалить из предпочтений'],
        sv: ['Ta bort från favoriter'],
        th: ['ลบออกจากรายการโปรด'],
        tr: ['Favorilerimden çıkar'],
        vi: ['Loại bỏ khỏi mục yêu thích'],
        zh: ['从收藏中移除'],
        zh_TW: ['從收藏移除'],
      };
    },
  },
]);
