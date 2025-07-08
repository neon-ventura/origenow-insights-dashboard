import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, HeadphonesIcon } from 'lucide-react';

const Suporte = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const {
    toast
  } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio do formulário
    toast({
      title: "Mensagem enviada!",
      description: "Sua mensagem foi enviada com sucesso. Retornaremos o contato em breve."
    });
    setFormData({
      nome: '',
      email: '',
      assunto: '',
      mensagem: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      email: '',
      assunto: '',
      mensagem: ''
    });
  };

  return <div className="p-6 px-0 py-0">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <HeadphonesIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Suporte</h1>
            <p className="text-gray-600 text-lg">Precisa de ajuda? Entre em contato com nossa equipe de suporte</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Contato */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Entre em contato</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <Input id="nome" name="nome" type="text" placeholder="Seu nome" value={formData.nome} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" placeholder="seu.email@exemplo.com" value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <Input id="assunto" name="assunto" type="text" placeholder="Assunto da sua mensagem" value={formData.assunto} onChange={handleInputChange} required />
                </div>
                
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <Textarea id="mensagem" name="mensagem" placeholder="Descreva detalhadamente como podemos ajudar..." rows={6} value={formData.mensagem} onChange={handleInputChange} required />
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Enviar mensagem
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Informações de Contato e FAQ */}
        <div className="space-y-6 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Informações de contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">contato@anye.com.br</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Telefone</h3>
                <p className="text-gray-600">(11) 3456-7890</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Horário de atendimento</h3>
                <p className="text-gray-600">Segunda a sexta: 9h às 18h</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Como configurar minha API?</h3>
                <p className="text-gray-600 text-sm">
                  Acesse a página de configurações e insira suas chaves de API nos campos correspondentes.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Quanto tempo leva para sincronizar produtos?</h3>
                <p className="text-gray-600 text-sm">
                  A sincronização de produtos geralmente leva de 5 a 15 minutos, dependendo da quantidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};

export default Suporte;
