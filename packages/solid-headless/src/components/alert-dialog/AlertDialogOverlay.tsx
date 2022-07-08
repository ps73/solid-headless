import {
  createSignal,
  createEffect,
  onCleanup,
  JSX,
} from 'solid-js';
import {
  Dynamic,
} from 'solid-js/web';
import {
  omitProps,
} from 'solid-use';
import {
  HeadlessDisclosureChildProps,
  HeadlessDisclosureChild,
} from '../../headless/disclosure/HeadlessDisclosureChild';
import { useHeadlessDisclosureProperties } from '../../headless/disclosure/HeadlessDisclosureContext';
import {
  createRef,
  DynamicComponentWithRef,
  DynamicNode,
  DynamicProps,
  ValidConstructor,
} from '../../utils/dynamic-prop';
import {
  useAlertDialogContext,
} from './AlertDialogContext';

export type AlertDialogOverlayProps<T extends ValidConstructor = 'div'> =
  & DynamicComponentWithRef<T>
  & HeadlessDisclosureChildProps
  & Omit<DynamicProps<T>, keyof HeadlessDisclosureChildProps>;

export function AlertDialogOverlay<T extends ValidConstructor = 'div'>(
  props: AlertDialogOverlayProps<T>,
): JSX.Element {
  const context = useAlertDialogContext('AlertDialogOverlay');
  const properties = useHeadlessDisclosureProperties();

  const [internalRef, setInternalRef] = createSignal<DynamicNode<T>>();

  createEffect(() => {
    const ref = internalRef();

    if (ref instanceof HTMLElement) {
      const onClick = () => {
        properties.setState(false);
      };

      ref.addEventListener('click', onClick);

      onCleanup(() => {
        ref.removeEventListener('click', onClick);
      });
    }
  });

  return (
    <Dynamic
      component={(props.as ?? 'div') as T}
      {...omitProps(props, [
        'as',
        'children',
        'ref',
      ])}
      data-sh-alert-dialog-overlay={context.ownerID}
      ref={createRef(props, (e) => {
        setInternalRef(() => e);
      })}
    >
      <HeadlessDisclosureChild>
        {props.children}
      </HeadlessDisclosureChild>
    </Dynamic>
  );
}
