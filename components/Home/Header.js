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
import {
  IconCoinRupee,
  IconHome,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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

export default function HeaderComponent() {
  const links = [
    {
      link: "/login",
      label: "Login",
    },
  ];

  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const router = useRouter();
  const { data: session } = useSession();

  const pathname = usePathname();

  useEffect(() => {
    setActive(pathname);
  }, []);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        router.push(link.link);
        close();
      }}
    >
      {link.label}
    </a>
  ));

  const links1 = [
    {
      link: "/",
      label: "Dashboard",
      icon: <IconHome />,
    },
    {
      link: "/transactions",
      label: "My Transactions",
      icon: <IconCoinRupee />,
    },
    {
      link: "/accounts",
      label: "My Accounts",
      icon: <IconUser />,
    },
  ];
  const items1 = links1.map((link) => (
    <Button
      key={link.label}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
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
        {/* <MantineLogo size={28} /> */}
        <Image src="./Title_Logo.png" width={100} />
        <Group spacing={5} className={classes.links}>
          {session ? (
            <>
              {items1}
              <Button
                className={cx(classes.link, {
                  [classes.linkActive]: active?.includes("/logout"),
                })}
                style={{ padding: "0px" }}
                onClick={(event) => {
                  event.preventDefault();
                  signOut();
                  router.push("/login");
                }}
                variant="white"
                leftIcon={<IconLogout />}
              >
                Logout
              </Button>
            </>
          ) : (
            items
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
              {session ? (
                <>
                  {items1}
                  <Button
                    className={cx(classes.link, {
                      [classes.linkActive]: active?.includes("/logout"),
                    })}
                    onClick={(event) => {
                      event.preventDefault();
                      signOut();
                      router.push("/login");
                    }}
                    variant="white"
                    style={{ padding: "10px" }}
                    leftIcon={<IconLogout />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                items
              )}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
