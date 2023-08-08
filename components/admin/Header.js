import { useEffect, useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
  Image,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import {
  IconCoinRupee,
  IconHome2,
  IconLogin,
  IconPigMoney,
  IconUserCircle,
} from "@tabler/icons-react";
import { IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 3,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

export default function HeaderComponent({
  links = [
    {
      link: "/admin/home",
      label: "Home",
      icon: <IconHome2 />,
    },
    {
      link: "/admin/customers",
      label: "Customers",
      icon: <IconUserCircle />,
    },
    {
      link: "/admin/accounts",
      label: "Accounts",
      icon: <IconPigMoney />,
    },
    {
      link: "/admin/transactions",
      label: "Transactions",
      icon: <IconCoinRupee />,
    },
  ],
}) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const router = useRouter();
  const pathname = usePathname();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (!session.user.isAdmin) {
        router.push("/");
      }
    }
  }, []);

  useEffect(() => {
    // setActive()
    setActive(pathname);
  }, []);

  const items = links.map((link) => (
    <Button
      key={link.label}
      // href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active?.includes(link.link),
      })}
      style={{ padding: "10px" }}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        router.push(link.link);
        close();
      }}
      variant="white"
      leftIcon={link.icon}
    >
      {link.label}
    </Button>
  ));

  const items1 = [
    {
      link: "/login",
      label: "Login",
      icon: <IconLogin />,
    },
  ].map((link) => (
    <Button
      key={link.label}
      className={cx(classes.link, {
        [classes.linkActive]: active?.includes(link.link),
      })}
      style={{ padding: "10px" }}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        router.push(link.link);
        close();
      }}
      variant="white"
      leftIcon={link.icon}
    >
      {link.label}
    </Button>
  ));

  return (
    <Header height={HEADER_HEIGHT} mb={10} className={classes.root}>
      <Container className={classes.header}>
        <Image src="../../../SBU-Final.png" width={100} />
        <Group spacing={5} className={classes.links}>
          {session ? items : items1}
          {session && (
            <Button
              key={"logout"}
              className={cx(classes.link, {
                [classes.linkActive]: active?.includes("/logout"),
              })}
              onClick={(event) => {
                event.preventDefault();
                setActive("");
                signOut();
                router.push("/login");
                close();
              }}
              variant="white"
              leftIcon={<IconLogout />}
            >
              Logout
            </Button>
          )}
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {session ? items : items1}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
