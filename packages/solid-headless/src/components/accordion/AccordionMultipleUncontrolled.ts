import {
  createComponent,
  JSX,
  mergeProps,
} from 'solid-js';
import {
  omitProps,
} from 'solid-use';
import {
  HeadlessSelectRootChildren,
  HeadlessSelectMultipleUncontrolledOptions,
  createHeadlessSelectRootMultipleUncontrolledProps,
} from '../../headless/select';
import createDynamic from '../../utils/create-dynamic';
import {
  createRef,
  ValidConstructor,
  HeadlessPropsWithRef,
  DynamicProps,
} from '../../utils/dynamic-prop';
import {
  createDisabled,
} from '../../utils/state-props';
import {
  AccordionContext,
  createAccordionFocusNavigator,
} from './AccordionContext';
import { ACCORDION_TAG } from './tags';

export type AccordionMultipleUncontrolledBaseProps<V> =
  & HeadlessSelectMultipleUncontrolledOptions<V>
  & HeadlessSelectRootChildren<V>;

export type AccordionMultipleUncontrolledProps<V, T extends ValidConstructor = 'div'> =
  HeadlessPropsWithRef<T, AccordionMultipleUncontrolledBaseProps<V>>;

export function AccordionMultipleUncontrolled<V, T extends ValidConstructor = 'div'>(
  props: AccordionMultipleUncontrolledProps<V, T>,
): JSX.Element {
  const controller = createAccordionFocusNavigator();

  return createComponent(AccordionContext.Provider, {
    value: controller,
    get children() {
      return createDynamic(
        () => props.as ?? ('div' as T),
        mergeProps(
          omitProps(props, [
            'as',
            'children',
            'disabled',
            'onChange',
            'toggleable',
            'defaultValue',
            'multiple',
            'ref',
          ]),
          {
            ref: createRef(props, (e) => {
              controller.setRef(e);
            }),
          },
          ACCORDION_TAG,
          createDisabled(() => props.disabled),
          createHeadlessSelectRootMultipleUncontrolledProps(props),
        ) as DynamicProps<T>,
      );
    },
  });
}
