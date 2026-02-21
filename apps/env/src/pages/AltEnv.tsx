import { FC, useState, useRef, RefObject, useEffect } from 'react';
import SelectionCarousel from '../components/SelectionCarousel';
import ServiceRow from '../components/ServiceRow';
import ApplyButton from '../components/ApplyButton';
import ChangesNotification from '../components/ChangesNotification';
import { useStateSubscription } from '../hooks/useStateSubscription';
import { useAppDispatch, useAppSelector } from '../utils/store';
import { useMutation } from '@apollo/client';
import { ServiceTarget } from '@/__generated__/graphql';
import {
  useKeyboardNavigation,
  createNavigationHelpers,
  KeyHandler,
  NavigationElement,
} from '../hooks/useKeyboardNavigation';
import { getUnappliedServices } from '../utils/helpers';
import { setTargetEnvironment, updateServices } from '../utils/slices/proxy';
import bigFirework from '../../assets/bigFirework.webm';
import styles from './styles/AltEnv.scss';
import { gql } from '@gql';

const SET_SERVICE_TARGETS = gql(`
  mutation SetServiceTargets($services: [ServiceTargetInput!]!) {
    setServiceTargets(services: $services) {
        name
        target
    }
  }
`);

const AltEnv: FC = () => {
  const dispatch = useAppDispatch();
  const {
    environments,
    services: appliedServices,
    targetEnvironment: appliedTargetEnvironment,
  } = useAppSelector((state) => state.proxy);
  const [services, setServices] = useState(appliedServices);
  const [currentEnvironmentIndex, setCurrentEnvironmentIndex] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [setServiceTargets, { loading }] = useMutation(SET_SERVICE_TARGETS);
  const carouselRef = useRef<HTMLDivElement>(null);
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const applyButtonRef = useRef<HTMLButtonElement>(null);
  const targetEnvironment = environments[currentEnvironmentIndex];
  useStateSubscription();

  const unappliedServices = getUnappliedServices(services, appliedServices);
  const unappliedTargetEnvironment =
    targetEnvironment.name !== appliedTargetEnvironment.name;
  const changesNeedToBeApplied =
    (unappliedServices || unappliedTargetEnvironment) && !isApplying;

  const handleServiceToggle = (index: number) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index
          ? {
              ...service,
              target:
                service.target === ServiceTarget.Local
                  ? ServiceTarget.Remote
                  : ServiceTarget.Local,
            }
          : service,
      ),
    );
  };

  const handleApply = async () => {
    setIsApplying(true);
    await setServiceTargets({
      variables: {
        services: services.map((service) => ({
          name: service.name.toLowerCase(),
          target: service.target,
        })),
      },
    });

    dispatch(setTargetEnvironment(targetEnvironment));
    dispatch(updateServices(services));
  };

  useEffect(() => {
    setIsApplying(loading);
  }, [loading]);

  const { navigateVertically, navigateHorizontally, executeAction } =
    createNavigationHelpers();

  const navigationElements: NavigationElement[] = [
    {
      ref: carouselRef,
      name: 'carousel',
      onAction: () => {},
    },
    {
      ref: servicesGridRef,
      name: 'services',
      getChildren: () =>
        Array.from(servicesGridRef.current?.children || []) as HTMLElement[],
      onAction: (index?: number) => {
        if (index !== undefined) handleServiceToggle(index);
      },
    },
    {
      ref: applyButtonRef,
      name: 'applyButton',
      onAction: () => {
        if (!isApplying) handleApply();
      },
    },
  ];

  const keyHandlers: KeyHandler[] = [
    {
      key: 'ArrowUp',
      handler: (_event, context) => navigateVertically('up', context),
    },
    {
      key: 'ArrowDown',
      handler: (_event, context) => navigateVertically('down', context),
    },
    {
      key: ['ArrowLeft', 'ArrowRight'],
      handler: (event, context) => {
        const direction = event.key === 'ArrowLeft' ? 'left' : 'right';
        navigateHorizontally(direction, context, (elementIndex, childIndex) => {
          if (elementIndex === 0) {
            // carousel
            const delta = direction === 'left' ? -1 : 1;
            setCurrentEnvironmentIndex(
              (prev) => (prev + delta + 3) % environments.length,
            );
          } else if (elementIndex === 1 && childIndex !== undefined) {
            // services
            handleServiceToggle(childIndex);
          }
        });
      },
    },
    {
      key: ' ',
      handler: (_event, context) => executeAction(context),
    },
    {
      key: 'Enter',
      handler: () => {
        if (changesNeedToBeApplied && !isApplying) handleApply();
      },
    },
  ];

  useKeyboardNavigation({
    elements: navigationElements,
    keyHandlers,
    dependencies: [currentEnvironmentIndex, isApplying, services.length],
  });

  return (
    <div className={styles.content}>
      <div className={styles.topSection}>
        <SelectionCarousel
          ref={carouselRef as RefObject<HTMLDivElement>}
          environments={environments}
          currentIndex={currentEnvironmentIndex}
          setCurrentIndex={setCurrentEnvironmentIndex}
          hasChanges={unappliedTargetEnvironment}
          disabled={isApplying}
          tabIndex={1}
        />
        {changesNeedToBeApplied && <ChangesNotification />}
      </div>
      <div className={styles.servicesSection}>
        <div className={styles.sectionHeader}>Services</div>
        <div className={styles.servicesGrid} ref={servicesGridRef}>
          {services.map((service, index) => (
            <ServiceRow
              key={service.name}
              name={service.name}
              isLocal={service.target === ServiceTarget.Local}
              onToggle={() => handleServiceToggle(index)}
              isApplied={service.target === appliedServices[index].target}
              disabled={isApplying}
              tabIndex={index + 2}
            />
          ))}
        </div>
      </div>
      <div className={styles.footerSection}>
        <video
          autoPlay
          loop
          muted
          height={200}
          width={200}
          className={styles.marioVideo}
        >
          <source src={bigFirework} type="video/webm" />
        </video>
        <ApplyButton
          ref={applyButtonRef}
          isApplying={isApplying}
          onApply={handleApply}
          tabIndex={services.length + 2}
          disabled={!changesNeedToBeApplied || isApplying}
        />
      </div>
    </div>
  );
};

export default AltEnv;
