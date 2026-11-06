--
-- PostgreSQL database dump
--

\restrict 1jMI3CAql8mzdpK4V80pOS7gYs3G2Jke7sGJHSPNYF5tgyw2feEAeNBshc9bY6q

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Mecanicos" DROP CONSTRAINT IF EXISTS "FK_e99e3f2f162535cc47f6171f67d";
ALTER TABLE IF EXISTS ONLY public."Mantenimientos" DROP CONSTRAINT IF EXISTS "FK_8230b5c2dff5be4bf33d963ce74";
ALTER TABLE IF EXISTS ONLY public."Mantenimientos" DROP CONSTRAINT IF EXISTS "FK_4e791604585a33c62b0e735a8ce";
ALTER TABLE IF EXISTS ONLY public."Mantenimientos" DROP CONSTRAINT IF EXISTS "FK_31c7a6487dedb8623b5537f48cb";
ALTER TABLE IF EXISTS ONLY public."Usuarios" DROP CONSTRAINT IF EXISTS "UQ_a68e6a4cafe1df9bcf7b9f6cc75";
ALTER TABLE IF EXISTS ONLY public."Vehiculos" DROP CONSTRAINT IF EXISTS "UQ_97035f15f72d741a28164481073";
ALTER TABLE IF EXISTS ONLY public."Mecanicos" DROP CONSTRAINT IF EXISTS "REL_e99e3f2f162535cc47f6171f67";
ALTER TABLE IF EXISTS ONLY public."Mantenimientos" DROP CONSTRAINT IF EXISTS "PK_c4209bca8143666013de0fc106b";
ALTER TABLE IF EXISTS ONLY public."Mecanicos" DROP CONSTRAINT IF EXISTS "PK_a8e381c7cfcc86483c3e08ae995";
ALTER TABLE IF EXISTS ONLY public."Usuarios" DROP CONSTRAINT IF EXISTS "PK_6b4c9e5c7d35b294307b3fd0fea";
ALTER TABLE IF EXISTS ONLY public."Talleres" DROP CONSTRAINT IF EXISTS "PK_58dc042b4291ef4b06b4d0a7bc4";
ALTER TABLE IF EXISTS ONLY public."Vehiculos" DROP CONSTRAINT IF EXISTS "PK_12e23efe819cdfb301a1e721432";
ALTER TABLE IF EXISTS public."Vehiculos" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Usuarios" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Talleres" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Mecanicos" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Mantenimientos" ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public."Vehiculos_id_seq";
DROP TABLE IF EXISTS public."Vehiculos";
DROP SEQUENCE IF EXISTS public."Usuarios_id_seq";
DROP TABLE IF EXISTS public."Usuarios";
DROP SEQUENCE IF EXISTS public."Talleres_id_seq";
DROP TABLE IF EXISTS public."Talleres";
DROP SEQUENCE IF EXISTS public."Mecanicos_id_seq";
DROP TABLE IF EXISTS public."Mecanicos";
DROP SEQUENCE IF EXISTS public."Mantenimientos_id_seq";
DROP TABLE IF EXISTS public."Mantenimientos";
DROP TYPE IF EXISTS public."Vehiculos_estado_enum";
DROP TYPE IF EXISTS public."Usuarios_role_enum";
DROP TYPE IF EXISTS public."Mantenimientos_tipo_enum";
DROP TYPE IF EXISTS public."Mantenimientos_estado_enum";
--
-- Name: Mantenimientos_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Mantenimientos_estado_enum" AS ENUM (
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."Mantenimientos_estado_enum" OWNER TO postgres;

--
-- Name: Mantenimientos_tipo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Mantenimientos_tipo_enum" AS ENUM (
    'PREVENTIVE',
    'CORRECTIVE'
);


ALTER TYPE public."Mantenimientos_tipo_enum" OWNER TO postgres;

--
-- Name: Usuarios_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Usuarios_role_enum" AS ENUM (
    'ADMIN',
    'TECHNICIAN'
);


ALTER TYPE public."Usuarios_role_enum" OWNER TO postgres;

--
-- Name: Vehiculos_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Vehiculos_estado_enum" AS ENUM (
    'AVAILABLE',
    'IN_MAINTENANCE',
    ' INACTIVE'
);


ALTER TYPE public."Vehiculos_estado_enum" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Mantenimientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mantenimientos" (
    id integer NOT NULL,
    tipo public."Mantenimientos_tipo_enum" NOT NULL,
    descripcion text NOT NULL,
    kilometraje integer NOT NULL,
    "fechaProgramada" timestamp with time zone NOT NULL,
    "fechaFinalizacion" timestamp with time zone NOT NULL,
    estado public."Mantenimientos_estado_enum" DEFAULT 'SCHEDULED'::public."Mantenimientos_estado_enum" NOT NULL,
    "trabajoRealizado" text,
    "costoFinal" numeric(12,2),
    "finishedAt" timestamp with time zone,
    "vehiculoId" integer NOT NULL,
    "kilometrajeFinal" integer,
    "mecanicoId" integer NOT NULL,
    "tallerId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "vehicleId" integer NOT NULL
);


ALTER TABLE public."Mantenimientos" OWNER TO postgres;

--
-- Name: Mantenimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Mantenimientos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Mantenimientos_id_seq" OWNER TO postgres;

--
-- Name: Mantenimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Mantenimientos_id_seq" OWNED BY public."Mantenimientos".id;


--
-- Name: Mecanicos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mecanicos" (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    correo character varying NOT NULL,
    especialidad character varying NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "usuarioId" integer
);


ALTER TABLE public."Mecanicos" OWNER TO postgres;

--
-- Name: Mecanicos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Mecanicos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Mecanicos_id_seq" OWNER TO postgres;

--
-- Name: Mecanicos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Mecanicos_id_seq" OWNED BY public."Mecanicos".id;


--
-- Name: Talleres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Talleres" (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    direccion character varying NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Talleres" OWNER TO postgres;

--
-- Name: Talleres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Talleres_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Talleres_id_seq" OWNER TO postgres;

--
-- Name: Talleres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Talleres_id_seq" OWNED BY public."Talleres".id;


--
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuarios" (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    correo character varying NOT NULL,
    "contraseña" character varying NOT NULL,
    role public."Usuarios_role_enum" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Usuarios" OWNER TO postgres;

--
-- Name: Usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuarios_id_seq" OWNER TO postgres;

--
-- Name: Usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuarios_id_seq" OWNED BY public."Usuarios".id;


--
-- Name: Vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vehiculos" (
    id integer NOT NULL,
    placa character varying NOT NULL,
    marca character varying NOT NULL,
    modelo character varying NOT NULL,
    "año" integer NOT NULL,
    kilometraje integer NOT NULL,
    estado public."Vehiculos_estado_enum" NOT NULL
);


ALTER TABLE public."Vehiculos" OWNER TO postgres;

--
-- Name: Vehiculos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Vehiculos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Vehiculos_id_seq" OWNER TO postgres;

--
-- Name: Vehiculos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Vehiculos_id_seq" OWNED BY public."Vehiculos".id;


--
-- Name: Mantenimientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mantenimientos" ALTER COLUMN id SET DEFAULT nextval('public."Mantenimientos_id_seq"'::regclass);


--
-- Name: Mecanicos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mecanicos" ALTER COLUMN id SET DEFAULT nextval('public."Mecanicos_id_seq"'::regclass);


--
-- Name: Talleres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Talleres" ALTER COLUMN id SET DEFAULT nextval('public."Talleres_id_seq"'::regclass);


--
-- Name: Usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios" ALTER COLUMN id SET DEFAULT nextval('public."Usuarios_id_seq"'::regclass);


--
-- Name: Vehiculos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehiculos" ALTER COLUMN id SET DEFAULT nextval('public."Vehiculos_id_seq"'::regclass);


--
-- Data for Name: Mantenimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mantenimientos" (id, tipo, descripcion, kilometraje, "fechaProgramada", "fechaFinalizacion", estado, "trabajoRealizado", "costoFinal", "finishedAt", "vehiculoId", "kilometrajeFinal", "mecanicoId", "tallerId", "createdAt", "vehicleId") FROM stdin;
\.


--
-- Data for Name: Mecanicos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mecanicos" (id, nombre, correo, especialidad, activo, "usuarioId") FROM stdin;
\.


--
-- Data for Name: Talleres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Talleres" (id, nombre, direccion, activo) FROM stdin;
\.


--
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuarios" (id, nombre, correo, "contraseña", role, "createdAt") FROM stdin;
\.


--
-- Data for Name: Vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vehiculos" (id, placa, marca, modelo, "año", kilometraje, estado) FROM stdin;
\.


--
-- Name: Mantenimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Mantenimientos_id_seq"', 1, false);


--
-- Name: Mecanicos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Mecanicos_id_seq"', 1, false);


--
-- Name: Talleres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Talleres_id_seq"', 1, false);


--
-- Name: Usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuarios_id_seq"', 1, false);


--
-- Name: Vehiculos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Vehiculos_id_seq"', 1, false);


--
-- Name: Vehiculos PK_12e23efe819cdfb301a1e721432; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehiculos"
    ADD CONSTRAINT "PK_12e23efe819cdfb301a1e721432" PRIMARY KEY (id);


--
-- Name: Talleres PK_58dc042b4291ef4b06b4d0a7bc4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Talleres"
    ADD CONSTRAINT "PK_58dc042b4291ef4b06b4d0a7bc4" PRIMARY KEY (id);


--
-- Name: Usuarios PK_6b4c9e5c7d35b294307b3fd0fea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "PK_6b4c9e5c7d35b294307b3fd0fea" PRIMARY KEY (id);


--
-- Name: Mecanicos PK_a8e381c7cfcc86483c3e08ae995; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mecanicos"
    ADD CONSTRAINT "PK_a8e381c7cfcc86483c3e08ae995" PRIMARY KEY (id);


--
-- Name: Mantenimientos PK_c4209bca8143666013de0fc106b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mantenimientos"
    ADD CONSTRAINT "PK_c4209bca8143666013de0fc106b" PRIMARY KEY (id);


--
-- Name: Mecanicos REL_e99e3f2f162535cc47f6171f67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mecanicos"
    ADD CONSTRAINT "REL_e99e3f2f162535cc47f6171f67" UNIQUE ("usuarioId");


--
-- Name: Vehiculos UQ_97035f15f72d741a28164481073; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehiculos"
    ADD CONSTRAINT "UQ_97035f15f72d741a28164481073" UNIQUE (placa);


--
-- Name: Usuarios UQ_a68e6a4cafe1df9bcf7b9f6cc75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "UQ_a68e6a4cafe1df9bcf7b9f6cc75" UNIQUE (correo);


--
-- Name: Mantenimientos FK_31c7a6487dedb8623b5537f48cb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mantenimientos"
    ADD CONSTRAINT "FK_31c7a6487dedb8623b5537f48cb" FOREIGN KEY ("tallerId") REFERENCES public."Talleres"(id);


--
-- Name: Mantenimientos FK_4e791604585a33c62b0e735a8ce; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mantenimientos"
    ADD CONSTRAINT "FK_4e791604585a33c62b0e735a8ce" FOREIGN KEY ("vehicleId") REFERENCES public."Vehiculos"(id);


--
-- Name: Mantenimientos FK_8230b5c2dff5be4bf33d963ce74; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mantenimientos"
    ADD CONSTRAINT "FK_8230b5c2dff5be4bf33d963ce74" FOREIGN KEY ("mecanicoId") REFERENCES public."Mecanicos"(id);


--
-- Name: Mecanicos FK_e99e3f2f162535cc47f6171f67d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mecanicos"
    ADD CONSTRAINT "FK_e99e3f2f162535cc47f6171f67d" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 1jMI3CAql8mzdpK4V80pOS7gYs3G2Jke7sGJHSPNYF5tgyw2feEAeNBshc9bY6q

